const GoalModel = require('../models/Goal');

class GoalsController {

  async getGoals(req, res) {
    const query = req.requestQuery;
    const limit = req.query.limit || 0;

    if (query.exercise) {
      query['exercise.name'] = query.exercise;
      delete query.exercise
    }

    if (query.after) {
      query['date'] = {"$gte": query.after }
    }

    try {
      const goals = await GoalModel.find(query).limit(limit);

      res.json({ goals })

    } catch(error) {
      next(error)
    }
  }

  async getGoal(req, res, next) {
    const id = req.params.id;

    try {
      const goal = await GoalModel.findById(id);

      res.json({ goal })

    } catch(error) {
      console.log({ error });
      next(error)
    }
  };

  async updateGoal(req, res, next) {
    const id = req.params.id;
    const update = req.body.goal;

    try {
      if (update.isCompleted) {
        update.percentageCompleted = 100;
        update.completedOn = new Date();
      }

      const updatedGoal = await GoalModel.findByIdAndUpdate(id, update, { new: true });

      res.status(200).json({ goal: updatedGoal })

    } catch(error) {
      next(error)
    }
  };

  async deleteGoal(req, res, next) {
    const id = req.params.id;

    try {
      const goal = await GoalModel.findOneAndDelete(id);

      res.status(200).json({})

    } catch(error) {
      next(error)
    }
  };

  async createGoal(req, res, next) {
    const goal = new GoalModel({
      ...req.body.goal,
      user: req.user._id
    });

    try {
      const newGoal = await goal.save();

      res.status(201).json({ goal: newGoal })

    } catch(error) {
      next(error)
    }
  }
}

module.exports = new GoalsController();
