'use strict';

const proxyquire = require('proxyquire').noCallThru();
const chai = require('chai')
    .use(require('chai-as-promised'));
const expect = chai.expect;
const sinon = require('sinon');

const Err = require('../../lib/util/error.js');

describe('PublishService', () => {
    context('publishToUser', () => {
        it('throws an error if the api call fails', async () => {
            const requestPromiseStub = sinon.stub();
            const publishService = proxyquire(
                '../../lib/service/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            requestPromiseStub.throws();

            const instance = new publishService({
                apiSecret: 'apiSecret',
                apiKey: 'apiKey',
                integrationId: 'integrationId',
                baseUrl: 'https://cloud.bynorth.com'
            });

            await expect(
                instance.publishToUser('userId', 'packet', 'test')
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
                '../../lib/service/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const instance = new publishService({
                apiSecret: 'apiSecret',
                apiKey: 'apiKey',
                integrationId: 'integrationId',
                baseUrl: 'https://cloud.bynorth.com'
            });

            const responseMock = { status: 'OK' };
            requestPromiseStub.resolves(responseMock);

            const response = await instance.publishToUser('userId', 'packet', 'test');

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
                '../../lib/service/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const instance = new publishService({
                apiSecret: 'apiSecret',
                apiKey: 'apiKey',
                integrationId: 'integrationId',
                baseUrl: 'https://cloud.bynorth.com'
            });

            requestPromiseStub.throws();
            const error = new Err.encryptedPublishToUser('Error during call to publish an encrypted packet to user');
            await expect(
                instance.encryptedPublishToUser('userId', 'encryptedPacket', 'test')
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
                '../../lib/service/publish.service.js', {
                    'request-promise-native': requestPromiseStub
                }
            );

            const instance = new publishService({
                apiSecret: 'apiSecret',
                apiKey: 'apiKey',
                integrationId: 'integrationId',
                baseUrl: 'https://cloud.bynorth.com'
            });

            const responseMock = { status: 'OK' };
            requestPromiseStub.resolves(responseMock);

            const response = await instance.encryptedPublishToUser('userId', 'encryptedPacket', 'test');

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
