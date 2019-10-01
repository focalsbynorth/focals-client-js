'use strict';

const crypto = require('crypto');

const config = require('./util/config.js').options;

const toleranceInMinutes = 5;
const toleranceInMilliseconds = 60 * toleranceInMinutes * 1000;

/**
 * Provides functionality to verify a signature against the received parameters
 * @module SignatureService
 */
const SignatureService = {
    /**
     * Verifies a provided signature against an expected value using your shared secret.
     *
     * @param {string} state             - The state query parameter
     * @param {string} timestamp         - The timestamp of when the signature was generated 
     *                                     (in seconds or milliseconds since epoch)
     * 
     * @param {string} signatureToVerify - The received signature to verify
     *
     * @returns {boolean} Whether or not the signature is valid
     */
    verifySignature: (state, timestamp, signatureToVerify) => {
        const timestampInMs = timestamp > 1000000000000 ? timestamp : timestamp * 1000;
        const deltaFromCurrentTime = Math.abs((Date.now() - timestampInMs));

        if (deltaFromCurrentTime > toleranceInMilliseconds) {
            return false;
        }

        const expectedSignature = crypto.createHmac('sha256', config.sharedSecret)
            .update(`${config.signingVersion}:${timestamp}:${state}`)
            .digest('hex');

        return (`${config.signingVersion}:${expectedSignature}` === signatureToVerify);
    },
};

module.exports = SignatureService;
