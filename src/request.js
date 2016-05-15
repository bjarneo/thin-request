'use strict';

const extend = require('extend');
const pkg = require('../package.json');

function createHeaders(params) {
    let headers = {
        'User-Agent': `${pkg.name}/${pkg.version} (https://github.com/bjarneo/${pkg.name})`,
        'Accept-Encoding': 'gzip,deflate'
    };

    if (!params.headers) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (params.headers) {
        headers = extend(headers, params.headers);
    }

    if (params.dataLength) {
        headers['Content-Length'] = params.dataLength;

        delete params.dataLength;
    }

    if (params.json) {
        headers['Content-Type'] = 'application/json';
    }

    return headers
}

const getProtocol = url => url.protocol === 'https:' ? require('https') : require('http');

function request(url, params) {
    if (!params) {
        params = {};
    }

    const data = JSON.stringify(params.body) || null;

    if (data) {
        params.dataLength = data.length;
    }

    const headers = createHeaders(params);

    if (!url && !params.url) {
        throw new TypeError('You need to provide an url.');
    }

    const endpoint = url || params.url;

    return new Promise((resolve, reject) => {
        const url = require('url').parse(endpoint);
        const fn = getProtocol(url);

        const opts = {
            hostname: url.hostname || params.hostname,
            port: url.port || params.port,
            path: url.path || params.path,
            protocol: url.protocol || params.protocol,
            method: params.method || 'GET',
            family: params.family || null,
            localAddress: params.localAddress || null,
            auth: params.auth || null,
            agent: params.agent || null,
            createConnection: params.createConnection || null
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
