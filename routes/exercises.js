const router = require('express').Router();
const exerciseModel = require('../models/Exercise');

router.get('/', async (req, res, next) => {

//   try {
//     const exercises = await exerciseModel.find({});
  
//     res.status(200).json({ exercises })

//   } catch(error) {
//     next(error);

//   }

    res.json({
        exercise: [{ id: 1, name: "Squat" }, { id: 2, name: "Bench" }, { id: 3, name: "Deadlift" }]
    })
});


module.exports = router;