const LiftRecordModel = require('../../models/LiftRecord');
const s3 = require('../../services/s3');
const liftRecordsController = require('../../controllers/lift-records-controller');
const httpMocks = require('node-mocks-http');
const { newLiftRecord, liftRecords } = require('../mocks/lift-records');

jest.mock('../../models/LiftRecord');
jest.mock('../../services/s3');

LiftRecordModel.prototype.save = jest.fn().mockResolvedValue(newLiftRecord);
LiftRecordModel.find = jest.fn().mockImplementation(() => {
  return {
    limit: () => {
      return {
        sort: () => Promise.resolve(liftRecords)
      }
    }
  }
});

const post = {
  media: { url: '/foo'}
}

s3.deleteObject = jest.fn().mockResolvedValue({
  Key: post.media.url
});

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

describe("liftRecordsController.createLiftRecord()", () => {
  beforeEach(() => {
    req.body = {
      liftRecord: newLiftRecord
    };
  })

  it('should return a 201 response code', async () => {
    await liftRecordsController.createLiftRecord(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return JSON body', async () => {
    await liftRecordsController.createLiftRecord(req, res, next);

    expect(res._getJSONData()).toEqual({
      liftRecord: newLiftRecord
    });
  })
})

describe("liftRecordsController.getLiftRecords()", () => {
  it('should return a 200 response code', async () => {
    await liftRecordsController.getLiftRecords(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return all liftRecords', async () => {
    await liftRecordsController.getLiftRecords(req, res, next);

    expect(res._getJSONData()).toEqual({
      liftRecords
    });
  })
})

describe("liftRecordsController.getLiftRecord()", () => {
  it('should return a 200 response code', async () => {
    LiftRecordModel.findById = jest.fn().mockResolvedValue(newLiftRecord);

    req.params.id = newLiftRecord.id;

    await liftRecordsController.getLiftRecord(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return a liftRecord', async () => {
    LiftRecordModel.findById = jest.fn().mockResolvedValue(newLiftRecord);
    req.params.id = newLiftRecord.id;

    await liftRecordsController.getLiftRecord(req, res, next);

    expect(res._getJSONData()).toEqual({
      liftRecord: newLiftRecord
    });
  })
})

describe("liftRecordsController.updateLiftRecord()", () => {
  it('should return a 200 response code', async () => {
    LiftRecordModel.findByIdAndUpdate = jest.fn().mockResolvedValue(newLiftRecord);
    req.params.id = newLiftRecord.id;
    req.body.liftRecord = newLiftRecord;

    await liftRecordsController.updateLiftRecord(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return a updated liftRecord', async () => {
    LiftRecordModel.findByIdAndUpdate = jest.fn().mockResolvedValue(newLiftRecord);
    req.params.id = newLiftRecord.id;
    req.body.liftRecord = newLiftRecord;

    await liftRecordsController.updateLiftRecord(req, res, next);

    expect(res._getJSONData()).toStrictEqual({
      liftRecord: newLiftRecord
    });
  })
})

describe("liftRecordsController.deleteLiftRecord()", () => {
  it('should return a 200 response code', async () => {
    LiftRecordModel.findOneAndDelete = jest.fn().mockResolvedValue({});

    req.params.id = newLiftRecord.id;

    await liftRecordsController.deleteLiftRecord(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it('should return an empty body', async () => {
    LiftRecordModel.findOneAndDelete = jest.fn().mockResolvedValue({});
    req.params.id = newLiftRecord.id;

    await liftRecordsController.deleteLiftRecord(req, res, next);

    expect(res._getJSONData()).toEqual({});
  })
})
