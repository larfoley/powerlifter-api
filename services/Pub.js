const Service = require('./Service');
const request = require('request');

const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyBHwlgd3CSFCX1qYV-VhIALnyMDa3LWb1A`;

module.exports = class PubService {

  async findAll() {
    return new Promise((resolve, reject) => {
        request(url, (err, res) => {
            if (err) reject(err);
            resolve(res)
        });
    })
  }
}