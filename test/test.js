const request = require('supertest');
const express = require('express');
const app = require('../app').app;

describe('GET /users', function () {
    it('respond with json containing a list of all users', (done) => {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect(401, done);
    });
});
//
// describe('POST /users', function () {
//     let data = {
//         "id": "1",
//         "name": "dummy",
//         "contact": "dummy",
//         "address": "dummy"
//     }
//     it('respond with 201 created', function (done) {
//         request(app)
//             .post('/users')
//             .send(data)
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             });
//     });
// });
