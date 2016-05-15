'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

module.exports = function startServer(done) {
    app.get('/get/:id', (req, res) => {
        res.format({
            html: () => res.send(`<p>${req.params.id}</p>`),
            json: () => res.send({
                it: 'works',
                id: req.params.id
            })
        });
    });

    app.post('/post', (req, res) => {
        res.format({
            text: () => res.send(req.body),
            json: () => res.send(req.body)
        });
    });

    app.put('/put/:id', (req, res) => {
        res.json({
            body: req.body,
            id: req.params.id
        });
    });

    app.patch('/patch/:id', (req, res) => {
        res.json({
            body: req.body,
            id: req.params.id
        });
    });

    app.delete('/delete/:id', (req, res) => {
        res.json({
            id: req.params.id
        });
    });

    app.listen(3000);

    done();
};
