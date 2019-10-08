'use strict';

const chai = require('chai')
    .use(require('chai-as-promised'));
const expect = chai.expect;

const config = require('../../lib/util/config.js');

describe('Config', () => {
    context('init', () => {
        it('returns configured instances with correct values', () => {
            const firstConfig = {
                baseUrl: 'test',
                sharedSecret: 'sharedSecret',
                apiKey: 'apiKey',
                apiSecret: 'apiSecret',
                signingVersion: 'signingVersion',
                privateKey: 'privateKey',
                integrationId: 'integrationId'
            };
            const result = config.init({
                first: firstConfig,
                second: {}
            });

            expect(result.first.config).to.deep.equal(firstConfig);
            expect(result.second.config.baseUrl).to.equal('https://cloud.bynorth.com');
            expect(result.second.config.signingVersion).to.equal('v0');
            expect(result.second.config.sharedSecret).to.equal('');
            expect(result.second.config.apiKey).to.equal('');
            expect(result.second.config.apiSecret).to.equal('');
            expect(result.second.config.privateKey).to.equal('');
            expect(result.second.config.integrationId).to.equal('');
        });
    });

    context('get', () => {
        it('gets the instance based on the provided key', () => {
            config.init({
                first: {
                    integrationId: 'first'
                },
                second: {
                    integrationId: 'second'
                }
            });

            const result = config.get('second');

            expect(result.config.integrationId).to.equal('second');
        });

        it('gets the default instance when no key is provided and one instance is configured', () => {
            config.init({
                first: {
                    integrationId: 'first'
                }
            });

            const result = config.get();

            expect(result.config.integrationId).to.equal('first');
        });

        it('throws an exception when no parameter is provided and multiple instances are configured', () => {
            config.init({
                first: {
                    integrationId: 'first'
                },
                second: {
                    integrationId: 'second'
                }
            });

            expect(function() { config.get(); }).to.throw('A key must be provided if multiple abilities are configured');
        });
    });
});
