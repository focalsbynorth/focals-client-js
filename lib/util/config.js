'use strict';

const configOptions = {
    sharedSecret: '',
    apiKey: '',
    apiSecret: '',
    privateKey: '',
    integrationId: '',
    baseUrl: 'https://cloud.bynorth.com',
    signingVersion: 'v0'
};

/**
 * Handles configuring settings relating to your ability. Used by other services in this library.
 * @module Config
 */
const Config = {
    /**
     * Initializes the library config with settings for your ability
     * 
     * @param {object} opts - The options to configure - sharedSecret, apiKey, apiSecret. 
     *                        baseUrl and signingVersion have default values if not provided.
     * 
     * @returns {object} The current configuration object, with default values when none were given
     */
    init: (opts) => {
        if (opts.sharedSecret)      configOptions.sharedSecret = opts.sharedSecret;
        if (opts.apiKey)            configOptions.apiKey = opts.apiKey;
        if (opts.apiSecret)         configOptions.apiSecret = opts.apiSecret;
        if (opts.baseUrl)           configOptions.baseUrl = opts.baseUrl;
        if (opts.signingVersion)    configOptions.signingVersion = opts.signingVersion;
        if (opts.privateKey)        configOptions.privateKey = opts.privateKey;
        if (opts.integrationId)     configOptions.integrationId = opts.integrationId;

        return configOptions;
    },
    options: configOptions,
};

module.exports = Config;
