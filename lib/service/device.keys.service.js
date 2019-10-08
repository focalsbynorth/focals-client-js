'use strict';

const request = require('request-promise-native');

const Err = require('../util/error.js');

/**
 * Class for handling interaction with device keys for a user
 */
class DeviceKeysService {
    /**
     * @param {object} config - The configuration object containing the ability id, the API key and API Secret
     */
    constructor(config) {
        this.abilityConfig = config;
    }

    /**
     * Retrieves the public keys associated with a provided user id
     * 
     * @param {string} userId - The user to retrieve keys for
     * 
     * @returns {string[]} Array of all public keys associated with the user
     * @throws Will throw an error if the URL returns an error code response
     */
    async getPublicKeys(userId) {
        try {
            const response = await request({
                method: 'GET',
                uri: `${this.abilityConfig.baseUrl}/v1/api/integration/device-keys`,
                qs: {
                    userId: userId,
                    integrationId: this.abilityConfig.integrationId,
                    apiKey: this.abilityConfig.apiKey,
                    apiSecret: this.abilityConfig.apiSecret,
                },
                json: true
            });

            return response;
        } catch (error) {
            throw Err.deviceKeys();
        }
    }
};

module.exports = DeviceKeysService;
