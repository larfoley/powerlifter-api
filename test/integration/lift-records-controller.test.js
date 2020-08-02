require('dotenv').config();
const request = require('supertest');
const express = require('express');
const app = require('../../app').app;
const database = require('../../app').app;
const LiftRecordModel = require('../../models/LiftRecord');
const liftRecordsController = require('../../controllers/lift-records-controller');
const liftRecordsRouter = require('../../routers/lift-records-router');
const httpMocks = require('node-mocks-http');
const { newLiftRecord, liftRecords } = require('../mocks/lift-records');

app.use('/', liftRecordsRouter);

let token;
let currentUser;

beforeAll(async () => {
  const tokenResponse = await request(app)
    .post('/token')
    .send({
      grant_type: 'password',
      username: 'testuser',
      password: 'letmein123'
    });

  expect(tokenResponse.statusCode).toBe(200);

  token = 'Bearer ' + tokenResponse.body.access_token

  const currentUserResponse = await request(app)
    .get('/users/me')
    .set('Authorization', token);

  expect(currentUserResponse.statusCode).toBe(200);

  currentUser = currentUserResponse.body.user;
});

describe("/liftRecords", () => {
  beforeEach(async () => {
    const currentUserLiftRecords = liftRecords.map(lr => {
        lr.user = currentUser._id;

        return lr;
      })
      
    await LiftRecordModel.create(currentUserLiftRecords)
  })

  afterEach(async () => {
    await LiftRecordModel.collection.drop();
  })

  it('POST /liftRecords', async () => {
    const response = await request(app)
      .post('/liftRecords')
      .set('Authorization', token)
      .send({ liftRecord: newLiftRecord });

    expect(response.statusCode).toBe(201)
    expect(response.body.liftRecord.reps).toBe(newLiftRecord.reps);
    expect(response.body.liftRecord.weightLifted).toBe(newLiftRecord.weightLifted);
  })

  it('GET /liftRecords', async () => {
    const response = await request(app)
      .get('/liftRecords')
      .set('Authorization', token)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.liftRecords)).toBeTruthy();
    expect(response.body.liftRecords.length).toBe(liftRecords.length);
  })

  it('GET /liftRecords/:id', async () => {
    const response = await request(app)
      .get('/liftRecords/' + liftRecords[0]._id)
      .set('Authorization', token)

      expect(response.statusCode).toBe(200);
      expect(response.body.liftRecord.weightLifted).toBe(liftRecords[0].weightLifted);
      expect(response.body.liftRecord.reps).toBe(liftRecords[0].reps);
  })

  it('DELETE /liftRecords/:id', async () => {
    const response = await request(app)
      .delete('/liftRecords/' + liftRecords[0]._id)
      .set('Authorization', token)

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
  })
})
