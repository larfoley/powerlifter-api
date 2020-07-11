module.exports = {
  findAll(req) {
    Goals.find({
      user: req.user
    })
  }
}

class Service {
  constructor(req) {
    this.req = req
  }

  findGoal() {
  }
}

class GoalsService extends Service {

  getCurrentUsersGoals() {

  }

  updateGoal() {

  }
}
