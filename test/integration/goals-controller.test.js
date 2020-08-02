const request = require('supertest');
const express = require('express');
const app = require('../../app').app;
const GoalModel = require('../../models/Goal');
const goalsController = require('../../controllers/goals-controller');
const goalsRouter = require('../../routers/goals-router');
const httpMocks = require('node-mocks-http');
const { newGoal, goal } = require('../mocks/goals');

app.use('/', goalsRouter);

let token;

beforeAll(async () => {
  const response = await request(app)
    .post('/token')
    .send({
      grant_type: 'password',
      username: 'testuser',
      password: 'letmein123'
    });

  expect(response.statusCode).toBe(200);
  token = 'Bearer ' + response.body.access_token
});

describe("/goals", () => {
  beforeEach(() => {
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
  })
})
