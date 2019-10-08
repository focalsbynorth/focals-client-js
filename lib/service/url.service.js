'use strict';

/**
 * Class for building URLs to interact with the Abilities Framework API
 */
class UrlService {
    /**
     * @param {object} config - The configuration object containing the base URL if needed
     */
    constructor(config) {
        this.abilityConfig = config;
    }

    /**
     * Builds the URL for a call to enable the ability for a user
     * 
     * @param {string} state    - The state query parametery
     * @param {string} [error]  - The error encountered, if required
     * 
     * @returns {string} The constructed URL
     */
    buildEnableUrl(state, error) {
        let url = `${this.abilityConfig.baseUrl}/v1/api/integration/enable?state=${state}`;
        if (error) {
            url = `${url}&error=${encodeURIComponent(error)}`;
        }
        return url;
    }
}

module.exports = UrlService;
