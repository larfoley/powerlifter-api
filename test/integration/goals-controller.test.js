require('dotenv').config();
const request = require('supertest');
const express = require('express');
const app = require('../../app').app;
const database = require('../../app').app;
const GoalModel = require('../../models/Goal');
const goalsController = require('../../controllers/goals-controller');
const goalsRouter = require('../../routers/goals-router');
const httpMocks = require('node-mocks-http');
const { newGoal, goals } = require('../mocks/goals');

app.use('/', goalsRouter);

let token;

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
});

describe("/goals", () => {
  beforeEach(async () => {
    await GoalModel.create(goals)
  })

  afterEach(async () => {
    await GoalModel.collection.drop();
  })

  it('POST /goals', async () => {
    const response = await request(app)
      .post('/goals')
      .set('Authorization', token)
      .send({ goal: newGoal});

    expect(response.statusCode).toBe(201)
    expect(response.body.goal.reps).toBe(newGoal.reps);
    expect(response.body.goal.weight).toBe(newGoal.weight);
  })

  it('GET /goals', async () => {
    const response = await request(app)
      .get('/goals')
      .set('Authorization', token)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.goals)).toBeTruthy();
    expect(response.body.goals.length).toBe(goals.length);
  })

  it('GET /goals/:id', async () => {
    const response = await request(app)
      .get('/goals/' + goals[0]._id)
      .set('Authorization', token)

      expect(response.statusCode).toBe(200);
      expect(response.body.goal.weight).toBe(goals[0].weight);
      expect(response.body.goal.reps).toBe(goals[0].reps);
  })

  it('DELETE /goals/:id', async () => {
    const response = await request(app)
      .delete('/goals/' + goals[0]._id)
      .set('Authorization', token)

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({});
  })
})
