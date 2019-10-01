'use strict';

const UrlService = require('../lib/url.service.js');

describe('UrlService', () => {
    context('buildEnableUrl', () => {
        it('returns correct url with no error', () => {
            const expected = 'https://cloud.bynorth.com/v1/api/integration/enable?state=teststate';
            const actual = UrlService.buildEnableUrl('teststate');

            actual.should.equal(expected);
        });

        it('returns correct url with an error', () => {
            const expected = 'https://cloud.bynorth.com/v1/api/integration/enable?state=teststate&error=testerror';
            const actual = UrlService.buildEnableUrl('teststate', 'testerror');

            actual.should.equal(expected);
        });
    });
});
