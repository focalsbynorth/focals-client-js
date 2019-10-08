'use strict';

const chai = require('chai')
    .use(require('chai-as-promised'));
const expect = chai.expect;
const fs = require('fs');

const EncryptionService = require('../../lib/service/encryption.service.js');
const Err = require('../../lib/util/error.js');

describe('EncryptionService', () => {
    context('encryptPacket', () => {
        it('encrypts values', async () => {
            const publicKeys = [];
            publicKeys.push(fs.readFileSync('test/data/id_rsa.pub.pem').toString());
            const inputString = fs.readFileSync('test/data/plain.json').toString();
            const inputObject = JSON.parse(inputString);
            const pathsToEncrypt = [
                '/templateId',
                '/integrationId',
                '/actionId',
            ];

            const instance = new EncryptionService();

            const encryptedPacket = await instance.encryptPacket(inputObject, pathsToEncrypt, publicKeys);

            expect(encryptedPacket.hasOwnProperty('encrypted')).to.be.true;
            expect(encryptedPacket.plain.templateId.$ref).to.be.equal('#/encrypted/0');
            expect(encryptedPacket.plain.integrationId.$ref).to.be.equal('#/encrypted/1');
            expect(encryptedPacket.plain.actionId.$ref).to.be.equal('#/encrypted/2');
            expect(encryptedPacket.plain.responseText).to.be.equal('Response Text');
            expect(encryptedPacket.plain.packetId).to.be.equal('Id of the packet');
            expect(encryptedPacket.version).to.be.equal('2.0.0');
        });

        it('makes no changes if no paths to encrypt are provided', async () => {
            const publicKeys = [];
            publicKeys.push(fs.readFileSync('test/data/id_rsa.pub.pem').toString());
            const inputString = fs.readFileSync('test/data/plain.json').toString();
            const inputObject = JSON.parse(inputString);
            const pathsToEncrypt = [];

            const instance = new EncryptionService();

            const encryptedPacket = await instance.encryptPacket(inputObject, pathsToEncrypt, publicKeys);

            expect(encryptedPacket.hasOwnProperty('encrypted')).to.be.true;
            expect(encryptedPacket.plain.templateId).to.be.equal('cc16cc5e-1623-4ba0-bacd-df1f7be9e023');
            expect(encryptedPacket.plain.integrationId).to.be.equal('98792bcb-a936-4980-a13d-9531de88ab49');
            expect(encryptedPacket.plain.actionId).to.be.equal('get_spec');
            expect(encryptedPacket.plain.responseText).to.be.equal('Response Text');
            expect(encryptedPacket.plain.packetId).to.be.equal('Id of the packet');
            expect(encryptedPacket.version).to.be.equal('2.0.0');
        });

        it('throws an exception if an invalid path to encrypt is provided', async () => {
            const publicKeys = [];
            publicKeys.push(fs.readFileSync('test/data/id_rsa.pub.pem').toString());
            const inputString = fs.readFileSync('test/data/plain.json').toString();
            const inputObject = JSON.parse(inputString);
            const pathsToEncrypt = [
                '/templateId',
                '/invalid',
            ];

            const instance = new EncryptionService();

            const error = new Err.encryptionBadPath('A path to encrypt was provided that could not be found: /invalid');
            await expect(
                instance.encryptPacket(inputObject, pathsToEncrypt, publicKeys)
            ).to.be.rejected.and.eventually.deep.equal(error);
        });

        it('throws an exception if no public keys are provided', async () => {
            const inputString = fs.readFileSync('test/data/plain.json').toString();
            const inputObject = JSON.parse(inputString);
            const pathsToEncrypt = [
                '/templateId',
                '/integrationId',
                '/actionId'
            ];

            const instance = new EncryptionService();

            await expect(
                instance.encryptPacket(inputObject, pathsToEncrypt, null)
            ).to.be.rejected.and.eventually.deep.equal(new Err.publicKeys());
        });

        it('throws an exception if no input is provided', async () => {
            const publicKeys = [];
            publicKeys.push(fs.readFileSync('test/data/id_rsa.pub.pem').toString());
            const pathsToEncrypt = [
                '/templateId',
                '/integrationId',
                '/actionId'
            ];

            const instance = new EncryptionService();

            await expect(
                instance.encryptPacket(null, pathsToEncrypt, publicKeys)
            ).to.be.rejected.and.eventually.deep.equal(new Err.encryptionBadInput());
        });
    });

    context('decryptPacket', () => {
        it('decrypts values', async () => {
            const inputString = fs.readFileSync('test/data/encrypted.json').toString();
            const inputObject = JSON.parse(inputString);

            const instance = new EncryptionService({
                privateKey: fs.readFileSync('test/data/id_rsa.pem').toString()
            });

            const decryptedPacket = await instance.decryptPacket(inputObject);

            expect(decryptedPacket.actionId).to.be.equal('get_spec');
            expect(decryptedPacket.responseText).to.be.equal('Response Text');
            expect(decryptedPacket.packetId).to.be.equal('Id of the packet');
            expect(decryptedPacket.integrationId).to.be.equal('98792bcb-a936-4980-a13d-9531de88ab49');
        });

        it('decrypts flattened JWE packet', async () => {
            const inputString = fs.readFileSync('test/data/encrypted-flattened.json').toString();
            const inputObject = JSON.parse(inputString);

            const instance = new EncryptionService({
                privateKey: fs.readFileSync('test/data/id_rsa.pem').toString()
            });

            const decryptedPacket = await instance.decryptPacket(inputObject);

            expect(decryptedPacket.actionId).to.be.equal('get_spec');
            expect(decryptedPacket.responseText).to.be.equal('Response Text');
            expect(decryptedPacket.packetId).to.be.equal('Id of the packet');
            expect(decryptedPacket.integrationId).to.be.equal('98792bcb-a936-4980-a13d-9531de88ab49');
        });

        it('throws an exception if no config is provided', async () => {
            const inputString = fs.readFileSync('test/data/encrypted.json').toString();
            const inputObject = JSON.parse(inputString);

            const instance = new EncryptionService();

            await expect(
                instance.decryptPacket(inputObject)
            ).to.be.rejected.and.eventually.deep.equal(new Err.privateKey());
        });

        it('throws an exception if no private key is provided', async () => {
            const inputString = fs.readFileSync('test/data/encrypted.json').toString();
            const inputObject = JSON.parse(inputString);

            const instance = new EncryptionService({});

            await expect(
                instance.decryptPacket(inputObject)
            ).to.be.rejected.and.eventually.deep.equal(new Err.privateKey());
        });

        it('throws an exception if no input is provided', async () => {
            const instance = new EncryptionService();

            await expect(
                instance.decryptPacket(null)
            ).to.be.rejected.and.eventually.deep.equal(new Err.encryptionBadInput());
        });
    });
});
