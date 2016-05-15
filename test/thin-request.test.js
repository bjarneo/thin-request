'use strict';

const assert = require('assert');
const startServer = require('./start-server');
const request = require('../index');

describe('#deploy', () => {
    const endpoint = 'http://localhost:3000/';

    before(startServer);

    it('should do a get request', function(done) {
        request(endpoint + 'get/123', { json: true })
            .then(data => {
                assert(data.it === 'works');
                assert(parseInt(data.id, 10) === 123);

                done();
            })
            .catch(err => {
                throw new Error(err);
            });
    });

    it('should do a post request', function(done) {
        request(endpoint + 'post', {
            method: 'POST',
            json: true,
            body: {
                whatever: 'I\'m posting'
            }
        })
        .then(data => {
            assert(data.whatever === 'I\'m posting');

            done();
        })
        .catch(err => {
            throw new Error(err);
        });

        // THIS IS THE FAILING ONE
        request(endpoint + 'post', {
            method: 'POST',
            body: {
                whatever: 'I\'m posting'
            },
            headers: {
                'Content-Type': 'text/html'
            }
        })
        .then(data => {
            console.log('whaaa', data);

            assert(data === '<p>I\'m posting</p>');

            done();
        })
        .catch(err => {
            throw new Error(err);
        });
    });

    it('should do a put request', function(done) {
        request(endpoint + 'put/123', {
            method: 'PUT',
            json: true,
            body: {
                put: 'update or replace'
            }
        })
        .then(data => {
            assert(data.body.put === 'update or replace');
            assert(data.id === '123');

            done();
        })
        .catch(err => {
            throw new Error(err);
        });
    });

    it('should do a delete request', function(done) {
        request(endpoint + 'delete/123', {
            method: 'DELETE',
            json: true
        })
        .then(data => {
            assert(data.id === '123');

            done();
        })
        .catch(err => {
            throw new Error(err);
        });
    });
});
