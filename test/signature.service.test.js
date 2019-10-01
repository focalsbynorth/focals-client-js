'use strict';

const crypto = require('crypto');

const config = require('../lib/util/config.js');
const SignatureService = require('../lib/signature.service.js');

describe('SignatureService', () => {
    context('verifySignature', () => {
        before('init the config', () => {
            config.init({
                signingVersion: 'signingVersion',
                sharedSecret: 'sharedSecret'
            });
        });

        it('returns true for a valid signature with timestamp in milliseconds', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = SignatureService.verifySignature(
                'state',
                timestamp,
                expected);

            valid.should.be.true;
        });

        it('returns true for a valid signature with timestamp in seconds', () => {
            const timestamp = Date.now() / 1000;
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = SignatureService.verifySignature(
                'state',
                timestamp,
                expected);

            valid.should.be.true;
        });

        it('returns false with incorrect timestamp', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const invalidTimestamp = Date.now() + 1;

            const valid = SignatureService.verifySignature(
                'state',
                invalidTimestamp,
                expected);

            valid.should.be.false;
        });

        it('returns false with incorrect state', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = SignatureService.verifySignature(
                'invalidState',
                timestamp,
                expected);

            valid.should.be.false;
        });

        it('returns false with incorrect shared secret', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'invalidSharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = SignatureService.verifySignature(
                'state',
                timestamp,
                expected);

            valid.should.be.false;
        });

        it('returns false with incorrect signing version', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`invalidSigningVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = SignatureService.verifySignature(
                'state',
                timestamp,
                expected);

            valid.should.be.false;
        });
    });
});
