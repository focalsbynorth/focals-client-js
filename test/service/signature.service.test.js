'use strict';

const crypto = require('crypto');

const SignatureService = require('../../lib/service/signature.service.js');

describe('SignatureService', () => {
    context('verifySignature', () => {
        const instance = new SignatureService({
            signingVersion: 'signingVersion',
            sharedSecret: 'sharedSecret'
        });

        it('returns true for a valid signature with timestamp in milliseconds', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = instance.verifySignature(
                'state',
                timestamp,
                expected,
                'test');

            valid.should.be.true;
        });

        it('returns true for a valid signature with timestamp in seconds', () => {
            const timestamp = Date.now() / 1000;
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = instance.verifySignature(
                'state',
                timestamp,
                expected,
                'test');

            valid.should.be.true;
        });

        it('returns false with incorrect timestamp', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const invalidTimestamp = Date.now() + 1;

            const valid = instance.verifySignature(
                'state',
                invalidTimestamp,
                expected,
                'test');

            valid.should.be.false;
        });

        it('returns false with incorrect state', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = instance.verifySignature(
                'invalidState',
                timestamp,
                expected,
                'test');

            valid.should.be.false;
        });

        it('returns false with incorrect shared secret', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'invalidSharedSecret')
                .update(`signingVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = instance.verifySignature(
                'state',
                timestamp,
                expected,
                'test');

            valid.should.be.false;
        });

        it('returns false with incorrect signing version', () => {
            const timestamp = Date.now();
            const computedHmac = crypto.createHmac('sha256', 'sharedSecret')
                .update(`invalidSigningVersion:${timestamp}:state`)
                .digest('hex');
            const expected = `signingVersion:${computedHmac}`;

            const valid = instance.verifySignature(
                'state',
                timestamp,
                expected,
                'test');

            valid.should.be.false;
        });
    });
});
