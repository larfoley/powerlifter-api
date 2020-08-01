const supertest = require('supertest');
const express = require('express');
// const app = require('../../app').app;
// const request = supertest(app);
const GoalModel = require('../../models/Goal');
const goalsController = require('../../controllers/goals-controller');
const httpMocks = require('node-mocks-http');
const { newGoal, goals } = require('../mocks/goals');

GoalModel.prototype.save = jest.fn().mockResolvedValue(newGoal);
GoalModel.find = jest.fn().mockResolvedValue(goals);

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest({
    user: {
      _id: '1'
    },
    requestQuery: {}
  });
  res = httpMocks.createResponse();
  next = () => {}
})

describe("goalsController.createGoal()", () => {
  beforeEach(() => {
    req.body = {
      goal: newGoal
    };
  })

  it('should return a 201 response code', async () => {
    await goalsController.createGoal(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return JSON body', async () => {
    await goalsController.createGoal(req, res, next);

    expect(res._getJSONData()).toEqual({
      goal: newGoal
    });
  })
})

describe("goalsController.getGoals()", () => {
  it('should return a 200 response code', async () => {
    await goalsController.getGoals(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return all goals', async () => {
    await goalsController.getGoals(req, res, next);

    expect(res._getJSONData()).toEqual({
      goals
    });
  })
})

describe("goalsController.getGoal()", () => {
  it('should return a 200 response code', async () => {
    GoalModel.findById = jest.fn().mockResolvedValue(newGoal);

    req.params.id = newGoal.id;

    await goalsController.getGoal(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return a goal', async () => {
    GoalModel.findById = jest.fn().mockResolvedValue(newGoal);
    req.params.id = newGoal.id;

    await goalsController.getGoal(req, res, next);

    expect(res._getJSONData()).toEqual({
      goal: newGoal
    });
  })
})

describe("goalsController.updateGoal()", () => {
  it('should return a 200 response code', async () => {
    GoalModel.findByIdAndUpdate = jest.fn().mockResolvedValue(newGoal);
    req.params.id = newGoal.id;
    req.body.goal = newGoal;

    await goalsController.updateGoal(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return a updated goal', async () => {
    GoalModel.findByIdAndUpdate = jest.fn().mockResolvedValue(newGoal);
    req.params.id = newGoal.id;
    req.body.goal = newGoal;

    await goalsController.updateGoal(req, res, next);

    expect(res._getJSONData()).toStrictEqual({
      goal: newGoal
    });
  })
})

describe("goalsController.deleteGoal()", () => {
  it('should return a 200 response code', async () => {
    GoalModel.findOneAndDelete = jest.fn().mockResolvedValue({});

    req.params.id = newGoal.id;

    await goalsController.deleteGoal(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return an empty body', async () => {
    GoalModel.findOneAndDelete = jest.fn().mockResolvedValue({});
    req.params.id = newGoal.id;

    await goalsController.deleteGoal(req, res, next);

    expect(res._getJSONData()).toEqual({});
  })
})
