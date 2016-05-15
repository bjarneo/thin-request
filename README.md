Thin request
======
![Travis](https://travis-ci.org/bjarneo/thin-request.svg?branch=master)

Thin http(s) request promise wrapper.  

Installation
------
```bash
$ npm i --save thin-request
```

Usage
------
### GET
```js
request('https://www.endpoint.com', {
    path: '/user/1337',
    json: true // Sets application header to json. Also json parses the result.
})
.then(data => {
    // do whatever with the json result.
})
.catch(err => {
    throw new Error(err);
});
```

### POST
```js
request('https://www.endpoint.com', {
    path: '/user',
    method: 'POST',
    body: {
        data: 'posting'
    }
})
.then(data => {
    // do whatever with the result
})
.catch(err => {
    throw new Error(err);
});
```

### PUT
```js
request('https://www.endpoint.com', {
    path: '/user',
    method: 'PUT',
    body: {
        whatever: 'update/replace'
    }
})
.then(data => {
    // do whatever with the result
})
.catch(err => {
    throw new Error(err);
});
```

### DELETE
```js
request('https://www.endpoint.com', {
    path: '/user/1337'
})
.then(data => {
    // do whatever with the result
})
.catch(err => {
    throw new Error(err);
});
```

Options
------
This module takes care of these behind the scenes. You can easily override by defining
the ones you want in the input options.
```js
// parses the endpoint you provide
const url = require('url').parse(endpoint);

const opts = {
    hostname: url.hostname || params.hostname,
    port: url.port || params.port,
    path: url.path || params.path,
    protocol: url.protocol || params.protocol,
    json: false || params.json, // Take a look at GET example.
    method: params.method || 'GET',
    family: params.family || null,
    localAddress: params.localAddress || null,
    auth: params.auth || null,
    agent: params.agent || null,
    createConnection: params.createConnection || null
};
```
[Read more about options](https://nodejs.org/api/http.html#http_http_request_options_callback)

Tests
------
```bash
$ npm test
```

Contribution
------
Contributions are appreciated.

License
------
MIT-licensed. See LICENSE.
