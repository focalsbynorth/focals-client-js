'use strict';

const AbilityInstance = require('../ability.instance.js');
const Err = require('./error.js');

let abilities = {};

const getConfigValues = (abilityConfig) => {
    const configTemplate = {
        sharedSecret: abilityConfig.sharedSecret || '',
        apiKey: abilityConfig.apiKey || '',
        apiSecret: abilityConfig.apiSecret || '',
        privateKey: abilityConfig.privateKey || '',
        integrationId: abilityConfig.integrationId || '',
        baseUrl: abilityConfig.baseUrl || 'https://cloud.bynorth.com',
        signingVersion: abilityConfig.signingVersion || 'v0'
    };

    return configTemplate;
};

/**
 * Handles configuring settings relating to your ability. Used by other services in this library.
 * @module Config
 */
const Config = {
    /**
     * Initializes the abilities library for the provided configurations
     * 
     * @param {object} opts - The options to configure - sharedSecret, apiKey, apiSecret. 
     *                        baseUrl and signingVersion have default values if not provided.
     * 
     * @returns {object} The current configuration object, with default values when none were given
     */
    init: (optDictionary) => {
        abilities = {};

        for (const abilityKey in optDictionary) {
            const abilityConfig = getConfigValues(optDictionary[abilityKey]);
            const abilityInstance = new AbilityInstance(abilityConfig);

            abilities[abilityKey] = abilityInstance;
        }

        return abilities;
    },
    /**
     * Get the ability library instance
     * 
     * @param {string} [abilityKey] - The name of the ability used during init.
     *                                If only one ability is configured, the key can be omitted.
     * 
     * @throws Will throw an exception if the abilityKey parameter is not provided, and multiple abilities are configured
     * @returns The object instance for the ability
     */
    get: (abilityKey) => {
        // If no key is provided, and we have multiple abilities configured, throw an exception
        if (Object.keys(abilities).length > 1 && !abilityKey) {
            throw new Err.configKeyMissing();
        }

        // If no key is provided, and only a single ability is configured, return that
        if (Object.keys(abilities).length == 1 && !abilityKey) {
            // Return the single ability
            return Object.values(abilities)[0];
        }

        return abilities[abilityKey];
    },
};

module.exports = Config;
