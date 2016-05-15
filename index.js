'use strict';

const extend = require('extend');
const pkg = require('./package.json');

function createHeaders(params) {
    let headers = {
        'User-Agent': `${pkg.name}/${pkg.version} (https://github.com/bjarneo/${pkg.name})`,
        'Accept-Encoding': 'gzip,deflate'
    };
    // Create header creator
    if (!params.headers && params.method) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        /*
        {
        'Content-Length': data.length,

        }
        */
    }

    if (params.headers && params.method) {
        headers = extend(headers, params.headers);
    }

    if (params.json) {
        headers['Content-Type'] = 'application/json';
    }

    return headers
}

function request(url, params) {
    if (!params) {
        params = {};
    }

    const data = JSON.stringify(params.body) || null;

    const headers = createHeaders(params);

    if (!url && !params.url) {
        throw new TypeError('You need to provide an url.');
    }

    const endpoint = url || params.url;

    return new Promise((resolve, reject) => {
        const url = require('url').parse(endpoint);
        const fn = url.protocol === 'https:' ? require('https') : require('http');

        const opts = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            protocol: url.protocol,
            method: params.method || 'GET'
        };

        if (headers) {
            opts.headers = headers
        }

        const req = fn.request(opts, res => {
            const body = [];

            res.setEncoding('utf8');

            if (res.statusCode <= 200 && res.statusCode >= 299) {
                reject(res.statusCode);
            }

            res.on('data', chunk => body.push(chunk));

            res.on('end', () => {
                let data = body.join('');

                if (params.json) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        reject(e);
                    }
                }

                resolve(data);
            });
        });

        if (data) {
            req.write(data);
        }

        req.on('error', reject);

        req.end();
    });
};

module.exports = request;
