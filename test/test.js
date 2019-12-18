const assert = require('assert');
const nock = require('nock');
const { mockReq, mockRes } = require('sinon-express-mock');
const { expect } = require('chai');
const mongoSeed = require('mongo-seed');
const request = require('supertest');
const app = require('../app.js');
// require('dotenv').config();
const data = require('../test/seeds/users.js')
console.log(data);
describe('/users', () => {

  // before(function(done) {
  //   // console.log('Port', process.env.DB);
  //   // mongoSeed.load("cluster0-shard-00-02-frrek.mongodb.net", 3000, 'admin', "../test/seeds/", "users.js", function (err) {
  //   //   console.log('err', err);
  //   //   done()
  //   // });
  //
  // })

  it('responds with json', () => {

    nock('http://127.0.0.1:300')
    .get('/users')
    .reply(200, {
      results: [{ name: 'Dominic' }],
    });

    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        console.log(1, body);
        assert.equal(body, 0, 'No users')
      })
  });
});
