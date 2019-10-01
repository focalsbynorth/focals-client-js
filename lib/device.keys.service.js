'use strict';

const request = require('request-promise-native');

const config = require('./util/config.js').options;
const Err = require('./util/error.js');

/**
 * Provides functionality to help handle device keys associated with a user
 * @module DeviceKeysService
 */
const DeviceKeysService = {
    /**
     * Retrieves the public keys associated with a provided user id
     * 
     * @param {string} userId           - The user to retrieve keys for
     * 
     * @returns {string[]} Array of all public keys associated with the user
     * @throws Will throw an error if the URL returns an error code response
     */
    getPublicKeys: async (userId) => {
        try {
            const response = await request({
                method: 'GET',
                uri: `${config.baseUrl}/v1/api/integration/device-keys`,
                qs: {
                    userId: userId,
                    integrationId: config.integrationId,
                    apiKey: config.apiKey,
                    apiSecret: config.apiSecret,
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
