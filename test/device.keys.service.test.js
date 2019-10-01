'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai')
    .use(require('chai-as-promised'));
const expect = chai.expect;
const sinon = require('sinon');

const config = require('../lib/util/config.js');
const Err = require('../lib/util/error.js');

describe('DeviceKeysService', () => {
    context('getPublicKeys', () => {
        before('init the config', () => {
            config.init({
                apiSecret: 'apiSecret',
                apiKey: 'apiKey',
                integrationId: 'integrationId',
            });
        });

        it('throws an error if the api call fails', async () => {
            const requestPromiseStub = sinon.stub();
            const deviceKeysService = proxyquire(
                '../lib/device.keys.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            requestPromiseStub.throws();

            await expect(
                deviceKeysService.getPublicKeys('userId')
            ).to.be.rejected.and.eventually.deep.equal(new Err.deviceKeys('Error during call to get device keys'));

            expect(requestPromiseStub.calledOnceWith({
                method: 'GET',
                uri: 'https://cloud.bynorth.com/v1/api/integration/device-keys',
                qs: {
                    userId: 'userId',
                    integrationId: 'integrationId',
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret'
                },
                json: true
            })).to.be.true;
        });

        it('returns response if the api call is successful', async () => {
            const requestPromiseStub = sinon.stub();
            const deviceKeysService = proxyquire(
                '../lib/device.keys.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const responseMock = ['key1', 'key2'];
            requestPromiseStub.resolves(responseMock);

            const response = await deviceKeysService.getPublicKeys('userId');

            expect(response).to.deep.equal(['key1', 'key2']);

            expect(requestPromiseStub.calledOnceWith({
                method: 'GET',
                uri: 'https://cloud.bynorth.com/v1/api/integration/device-keys',
                qs: {
                    userId: 'userId',
                    integrationId: 'integrationId',
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret'
                },
                json: true
            })).to.be.true;
        });
    });
});
