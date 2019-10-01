'use strict';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const NorthClientLibrary = require('../index.js');

describe('Index', () => {
    context('Exports', () => {
        it('Only exports correct items', () => {
            NorthClientLibrary.should.be.an('object');
            Object.keys(NorthClientLibrary).length.should.equal(6);
            Object.keys(NorthClientLibrary).should.eql(
                [
                    'init',
                    'SignatureService',
                    'UrlService',
                    'EncryptionService',
                    'DeviceKeysService',
                    'PublishService',
                ]
            );
        });
    });
});
