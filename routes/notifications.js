const router = require('express').Router();
const createError = require('http-errors');
const NotificationModel = require('../models/Notification');

router.get('/', async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({});

    res.status(200).json({ notifications })

  } catch(error) {
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  const notification = new NotificationModel(req.body.notification);

  try {
    await notification.save();

    res.status(200).json({ notification });

  } catch(error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    await notification.findOneAndUpdate(req.body.notification);

    res.status(200).json({ notification });

  } catch(error) {
    next(error);
  }
});

module.exports = router;
