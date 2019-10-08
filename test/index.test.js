'use strict';

require('chai')
    .use(require('chai-as-promised'))
    .should();

const FocalsClient = require('../index.js');

describe('Index', () => {
    context('Exports', () => {
        it('Only exports correct items', () => {
            FocalsClient.should.be.an('object');
            Object.keys(FocalsClient).length.should.equal(2);
            Object.keys(FocalsClient).should.eql(
                [
                    'init',
                    'get',
                ]
            );
        });
    });
});
