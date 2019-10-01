'use strict';

const Err = require('egads').extend('Internal Server Error', 500, 'InternalServerError');

// Device Keys Errors
Err.deviceKeys = Err.extend('Error during call to get device keys', 500, 'DeviceKeysError');

// Encryption Errors
Err.publicKeys = Err.extend('Public keys must be provided to encrypt a packet', 500, 'PublicKeysError');
Err.privateKey = Err.extend('A private key must be configured during init to decrypt the packet', 500, 'PrivateKeyError');
Err.encryptionBadInput = Err.extend('Input must be provided to encrypt or decrypt the packet', 500, 'EncryptionInputError');
Err.encryptionBadPath = Err.extend('A path to encrypt was provided that could not be found', 500, 'EncryptionInputError');

// Publish To User Errors
Err.publishToUser = Err.extend('Error during call to publish packet to user', 500, 'PublishToUserError');
Err.encryptedPublishToUser = Err.extend('Error during call to publish an encrypted packet to user', 500, 
    'EncryptedPublishToUserError');

module.exports = Err;
