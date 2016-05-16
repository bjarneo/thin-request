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
    } else {
        headers = extend(headers, params.headers);
    }

    if (params.dataLength) {
        headers['Content-Length'] = params.dataLength;

        delete params.dataLength;
    }

    if (params.json) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
}

const getProtocol = url => url.protocol === 'https:' ? require('https') : require('http');

function request(endpoint, params) {
    if (!params) {
        params = {};
    }

    const data = JSON.stringify(params.body) || null;

    if (data) {
        params.dataLength = data.length;
    }

    const headers = createHeaders(params);

    if (!endpoint && !params.url) {
        throw new TypeError('You need to provide an url.');
    }

    return new Promise((resolve, reject) => {
        const url = require('url').parse(endpoint || params.url);
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
            opts.headers = headers;
        }

        const req = fn.request(opts, res => {
            const body = [];

            res.setEncoding('utf8');

            if (res.statusCode < 200 && res.statusCode > 299) {
                reject(res.statusCode);
            }

            res.on('data', chunk => body.push(chunk));

            res.on('end', () => {
                let response = body.join('');

                if (params.json) {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        reject(e);
                    }
                }

                resolve(response);
            });
        });

        if (data) {
            req.write(data);
        }

        req.on('error', reject);

        req.end();
    });
}

module.exports = request;
