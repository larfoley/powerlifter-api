const Service = require('./Service');
const Goal = require('../models/Goal');

module.exports = class GoalService extends Service {
  constructor() {
    super(Goal);
  }
}
