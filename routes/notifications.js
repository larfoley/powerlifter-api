const router = require('express').Router();
const createError = require('http-errors');
const NotificationModel = require('../models/Notification');

router.get('/', async (req, res, next) => {
  try {
    const notifications = await NotificationModel.find({
      for: req.user._id
    });

    res.status(200).json({ notifications })

  } catch(error) {
    next(error)
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const notification = await NotificationModel.findById(id);

    res.status(200).json({ notification });

  } catch(error) {
    next(error);
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

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  const update = req.body.notification;

  try {
    const notification = await NotificationModel.findByIdAndUpdate(id, update);

    res.status(200).json({ notification });

  } catch(error) {
    next(error);
  }
});

module.exports = router;
