'use strict';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const UrlService = require('../../lib/service/url.service.js');

describe('UrlService', () => {
    context('buildEnableUrl', () => {
        it('returns correct url with no error', () => {
            const expected = 'https://cloud.bynorth.com/v1/api/integration/enable?state=teststate';

            const instance = new UrlService({
                baseUrl: 'https://cloud.bynorth.com'
            });

            const actual = instance.buildEnableUrl('teststate');

            actual.should.equal(expected);
        });

        it('returns correct url with an error', () => {
            const expected = 'https://cloud.bynorth.com/v1/api/integration/enable?state=teststate&error=testerror';

            const instance = new UrlService({
                baseUrl: 'https://cloud.bynorth.com'
            });

            const actual = instance.buildEnableUrl('teststate', 'testerror');

            actual.should.equal(expected);
        });
    });
});
