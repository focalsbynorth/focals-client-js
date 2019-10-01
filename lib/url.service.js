'use strict';

const config = require('./util/config.js').options;

/**
 * Provides functionality to help handle device keys associated with a user
 * @module UrlService
 */
const UrlService = {
    /**
     * Builds the URL for a call to enable the ability for a user
     * 
     * @param {string} state    - The state query parametery
     * @param {string} [error]  - The error encountered, if required
     * 
     * @returns {string} The constructed URL
     */
    buildEnableUrl: (state, error) => {
        let url = `${config.baseUrl}/v1/api/integration/enable?state=${state}`;
        if (error) {
            url = `${url}&error=${encodeURIComponent(error)}`;
        }
        return url;
    },
};

module.exports = UrlService;
