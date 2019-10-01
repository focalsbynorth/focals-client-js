'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai')
    .use(require('chai-as-promised'));
const expect = chai.expect;
const sinon = require('sinon');

const config = require('../lib/util/config.js');
const Err = require('../lib/util/error.js');

describe('PublishService', () => {
    before('init the config', () => {
        config.init({
            apiSecret: 'apiSecret',
            apiKey: 'apiKey',
            integrationId: 'integrationId'
        });
    });

    context('publishToUser', () => {
        it('throws an error if the api call fails', async () => {
            const requestPromiseStub = sinon.stub();
            const publishService = proxyquire(
                '../lib/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            requestPromiseStub.throws();

            await expect(
                publishService.publishToUser('userId', 'packet')
            ).to.be.rejected.and.eventually.deep.equal(new Err.publishToUser('Error during call to publish packet to user'));

            expect(requestPromiseStub.calledOnceWith({
                method: 'POST',
                uri: 'https://cloud.bynorth.com/v1/api/integration/publish-to-user',
                body: {
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret',
                    integrationId: 'integrationId',
                    targetUserId: 'userId',
                    packet: 'packet'
                },
                json: true
            })).to.be.true;
        });

        it('returns response if the api call is successful', async () => {
            const requestPromiseStub = sinon.stub();
            const publishService = proxyquire(
                '../lib/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const responseMock = { status: 'OK' };
            requestPromiseStub.resolves(responseMock);

            const response = await publishService.publishToUser('userId', 'packet');

            expect(response).to.deep.equal(responseMock);

            expect(requestPromiseStub.calledOnceWith({
                method: 'POST',
                uri: 'https://cloud.bynorth.com/v1/api/integration/publish-to-user',
                body: {
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret',
                    integrationId: 'integrationId',
                    targetUserId: 'userId',
                    packet: 'packet'
                },
                json: true
            })).to.be.true;
        });
    });

    context('encryptedPublishToUser', () => {
        it('throws an error if the api call fails', async () => {
            const requestPromiseStub = sinon.stub();
            const publishService = proxyquire(
                '../lib/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            requestPromiseStub.throws();
            const error = new Err.encryptedPublishToUser('Error during call to publish an encrypted packet to user');
            await expect(
                publishService.encryptedPublishToUser('userId', 'encryptedPacket')
            ).to.be.rejected.and.eventually.deep.equal(error);

            expect(requestPromiseStub.calledOnceWith({
                method: 'POST',
                uri: 'https://cloud.bynorth.com/v1/api/integration/secure/publish-to-user',
                body: {
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret',
                    integrationId: 'integrationId',
                    targetUserId: 'userId',
                    packet: 'encryptedPacket'
                },
                json: true
            })).to.be.true;
        });

        it('returns response if the api call is successful', async () => {
            const requestPromiseStub = sinon.stub();
            const publishService = proxyquire(
                '../lib/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const responseMock = { status: 'OK' };
            requestPromiseStub.resolves(responseMock);

            const response = await publishService.encryptedPublishToUser('userId', 'encryptedPacket');

            expect(response).to.deep.equal(responseMock);

            expect(requestPromiseStub.calledOnceWith({
                method: 'POST',
                uri: 'https://cloud.bynorth.com/v1/api/integration/secure/publish-to-user',
                body: {
                    apiKey: 'apiKey',
                    apiSecret: 'apiSecret',
                    integrationId: 'integrationId',
                    targetUserId: 'userId',
                    packet: 'encryptedPacket'
                },
                json: true
            })).to.be.true;
        });
    });
});
