'use strict';

const request = require('request-promise-native');

const config = require('./util/config.js').options;
const Err = require('./util/error.js');


const PublishService = {
    /**
     * Publishes a packet to a user through the Focals Developer API API.
     * 
     * @param {string} userId           - The user to retrieve keys for
     * @param {object} packet           - The packet to publish
     * 
     * @returns 200 OK
     * @throws Will throw an error if the URL returns an error code response
     */
    publishToUser: async (userId, packet) => {
        try {
            const response = await request({
                method: 'POST',
                uri: `${config.baseUrl}/v1/api/integration/publish-to-user`,
                body: {
                    apiKey: config.apiKey,
                    apiSecret: config.apiSecret,
                    integrationId: config.integrationId,
                    targetUserId: userId,
                    packet: packet
                },
                json: true
            });

            return response;
        } catch (error) {
            throw Err.publishToUser();
        }
    },
    /**
     * Publishes an encrypted packet to a user through the Focals Developer API API.
     * 
     * @param {string} userId           - The user to retrieve keys for
     * @param {object} encryptedPacket  - The encrypted packet to publish
     * 
     * @returns 200 OK
     * @throws Will throw an error if the URL returns an error code response
     */
    encryptedPublishToUser: async (userId, encryptedPacket) => {
        try {
            const response = await request({
                method: 'POST',
                uri: `${config.baseUrl}/v1/api/integration/secure/publish-to-user`,
                body: {
                    apiKey: config.apiKey,
                    apiSecret: config.apiSecret,
                    integrationId: config.integrationId,
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
};

module.exports = PublishService;
