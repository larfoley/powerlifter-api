const router = require('express').Router();
const PubService = require('../services/Pub');
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=bar&key=AIzaSyBHwlgd3CSFCX1qYV-VhIALnyMDa3LWb1A`;
const request = require('request');

router.get('/', async (req, res, next) => {
  
    request(url, (err, response) => {
        if (err) next(err);

        let results = JSON.parse(response.body).results;

        res.json(results);
    });

});

router.get('/:id', async (req, res, next) => {
  
    // request(url, (err, response) => {
    //     if (err) next(err);

    //     let results = JSON.parse(response.body).results;

    //     res.json(results);
    // });

    res.json({
        pub: {
            id: req.params.id,
            title: 'foo'
        }
    })

});


module.exports = router;

