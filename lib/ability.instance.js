'use strict';

const DeviceKeysService = require('./service/device.keys.service.js');
const EncryptionService = require('./service/encryption.service.js');
const PublishService = require('./service/publish.service.js');
const SignatureService = require('./service/signature.service.js');
const UrlService = require('./service/url.service.js');

class AbilityInstance {
    constructor(config) {
        this.config = config;
        this.deviceKeysService = new DeviceKeysService(config);
        this.encryptionService = new EncryptionService(config);
        this.publishService = new PublishService(config);
        this.signatureService = new SignatureService(config);
        this.urlService = new UrlService(config);
    }
}

module.exports = AbilityInstance;
