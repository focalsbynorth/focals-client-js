'use strict';

const jose = require('node-jose');
const NodeRSA = require('node-rsa');
const jsonpointer = require('jsonpointer');
const jsonrefs = require('json-refs');

const Err = require('../util/error.js');

const wrapperVersion = '2.0.0';

const convertPublicKeys = async (publicKeys) => {
    const keystore = jose.JWK.createKeyStore();
    const convertedKeys = [];

    for (let publicKey of publicKeys) {
        if (publicKey.startsWith('-----BEGIN RSA PUBLIC KEY----')) {
            const key = new NodeRSA();
            key.importKey(publicKey, 'pkcs1-public');
            publicKey = key.exportKey('pkcs8-public');
        }

        const convertedKey = await keystore.add(publicKey, 'pem');
        convertedKeys.push(convertedKey);
    }

    return convertedKeys;
};

const getReplacedObject = (input) => {
    let inputString = JSON.stringify(input);
    inputString = inputString.replace(/\$ref/g, '$$$$ref');
    return JSON.parse(inputString);
};

const getEncryptedPaths = (inputObject, pathsToEncrypt) => {
    const valuesToEncrypt = [];
    let encryptedFieldCount = 0;

    for (const pathIndex in pathsToEncrypt) {
        const path = pathsToEncrypt[pathIndex];
        const value = jsonpointer.get(inputObject, path);
        if (!value) {
            throw Err.encryptionBadPath(`A path to encrypt was provided that could not be found: ${path}`);
        }
        valuesToEncrypt.push(value);
        
        jsonpointer.set(inputObject, path, { $ref: `#/encrypted/${encryptedFieldCount}` });
        
        encryptedFieldCount++;
    }

    return valuesToEncrypt;
};

const getFinalEncryptedPacket = async (inputObject, valuesToEncrypt, publicKeys) => {
    const jsonStringToEncrypt = JSON.stringify(valuesToEncrypt);
    const encrypted = await jose.JWE.createEncrypt(
        {
            protect: false,
            contentAlg: 'A256CBC-HS512'
        }, publicKeys).update(jsonStringToEncrypt).final();

    return {
        version: wrapperVersion,
        plain: inputObject,
        encrypted
    };
};

const decryptValues = async (input, abilityConfig) => {
    const keystore = jose.JWK.createKeyStore();
    const key = await keystore.add(abilityConfig.privateKey, 'pem');
    const decryptKey = jose.JWE.createDecrypt(key);
    const decrypted = await decryptKey.decrypt(input.encrypted);
    return JSON.parse(decrypted.plaintext);
};

const resolveObject = async (input) => {
    const resolvedRefs = await jsonrefs.resolveRefs(input, {
        filter: ['local']
    });
    const originalObject = resolvedRefs.resolved.plain;

    // Unescape any escaped $refs from the original plaintext
    let plainString = JSON.stringify(originalObject);
    plainString = plainString.replace(/\$\$ref/g, '$$ref'); 
    return JSON.parse(plainString);
};

/** Unflattens a flattened JWE by moving top-level parameters into a recipients object
 *  Has no effect on a non-flattened JWE 
 * @param {object} input    - The JWE.  Will be modified in-place
 */
const unflatten = (input) => {
    if (input.encrypted.recipients) {
        return input;
    }
    input.encrypted.recipients = [
        {
            encrypted_key: input.encrypted.encrypted_key,
            header: input.encrypted.header,
        }
    ]; // TODO, handle unprotected as well?
    delete input.encrypted.encrypted_key;
    delete input.encrypted.header;
    return input;
};

const validateEncryptionData = (input, publicKeys) => {
    if (!publicKeys || publicKeys.length == 0) {
        throw Err.publicKeys();
    }

    if (!input) {
        throw Err.encryptionBadInput();
    }
};

const validateDecryptionData = (input, abilityConfig) => {
    if (!input) {
        throw Err.encryptionBadInput();
    }
    
    if (!abilityConfig || !abilityConfig.privateKey) {
        throw Err.privateKey();
    }
};

/**
 * Class for handling encryption and decryption of packets
 */
class EncryptionService {
    /**
     * @param {object} config - The configuration object containing the 
     */
    constructor(config) {
        this.abilityConfig = config;
    }

    /**
     * Encrypts the provided paths on a packet using the provided public keys.
     * 
     * @param {object} input            - The packet object containing the values to encrypt
     * @param {string[]} pathsToEncrypt - An array of paths on the input object to encrypt
     * @param {string[]} publicKeys     - An array of string values of the public keys to use for encryption
     * 
     * @returns {object} The modified packet input with encrypted values
     * @throws Will throw an error if invalid input is provided, or a path to encrypt cannot be found
     */
    async encryptPacket(input, pathsToEncrypt, publicKeys) {
        validateEncryptionData(input, publicKeys);
        
        const inputObject = getReplacedObject(input);
        const valuesToEncrypt = getEncryptedPaths(inputObject, pathsToEncrypt);
        const convertedKeys = await convertPublicKeys(publicKeys);
        return getFinalEncryptedPacket(inputObject, valuesToEncrypt, convertedKeys);
    }

    /**
     * Decrypts the provided packet using the configured private key.
     * 
     * @param {object} input - The encrypted packet object
     * 
     * @returns {object} The decrypted packet
     * @throws Will throw an error if invalid input is provided, or if the private key has not been configured when createing the EncryptionService object
     */
    async decryptPacket(input) {
        validateDecryptionData(input, this.abilityConfig);

        unflatten(input);
        input.encrypted = await decryptValues(input, this.abilityConfig);
        return resolveObject(input);
    }
};

module.exports = EncryptionService;
