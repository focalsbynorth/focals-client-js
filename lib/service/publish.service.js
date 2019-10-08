'use strict';

const request = require('request-promise-native');

const Err = require('../util/error.js');

/**
 * Class for handling publishing a packet to a user
 */
class PublishService {
    /**
     * @param {object} config  - The configuration object containing the ability id, the API key and API Secret
     */
    constructor(config) {
        this.abilityConfig = config;
    }

    /**
     * Publishes a packet to a user through the Abilities Framework API.
     * 
     * @param {string} userId   - The user to retrieve keys for
     * @param {object} packet   - The packet to publish
     * 
     * @returns 200 OK
     * @throws Will throw an error if the URL returns an error code response
     */
    async publishToUser(userId, packet) {
        try {
            const response = await request({
                method: 'POST',
                uri: `${this.abilityConfig.baseUrl}/v1/api/integration/publish-to-user`,
                body: {
                    apiKey: this.abilityConfig.apiKey,
                    apiSecret: this.abilityConfig.apiSecret,
                    integrationId: this.abilityConfig.integrationId,
                    targetUserId: userId,
                    packet: packet
                },
                json: true
            });

            return response;
        } catch (error) {
            throw Err.publishToUser();
        }
    }

    /**
     * Publishes an encrypted packet to a user through the Abilities Framework API.
     * 
     * @param {string} userId           - The user to retrieve keys for
     * @param {object} encryptedPacket  - The encrypted packet to publish
     * 
     * @returns 200 OK
     * @throws Will throw an error if the URL returns an error code response
     */
    async encryptedPublishToUser(userId, encryptedPacket) {
        try {
            const response = await request({
                method: 'POST',
                uri: `${this.abilityConfig.baseUrl}/v1/api/integration/secure/publish-to-user`,
                body: {
                    apiKey: this.abilityConfig.apiKey,
                    apiSecret: this.abilityConfig.apiSecret,
                    integrationId: this.abilityConfig.integrationId,
                    targetUserId: userId,
                    packet: encryptedPacket
                },
                json: true
            });

            return response;
        } catch (error) {
            throw Err.encryptedPublishToUser();
        }
    }
}

module.exports = PublishService;
