module.exports = class Service {
  constructor(model) {
    this._Model = model
  }


  async findAll() {
    return new Promise((resolve, reject) => {
      this._Model.find({}, (err, model) => {
        if (err) reject(err);
        resolve(model);
      });
    })
  }

  async find(model) {
    return new Promise((resolve, reject) => {
      this._Model.findOne(model, (err, model) => {
        if (err) reject(err);

        resolve(model);
      });
    })
  }

  async findById(id) {
    return new Promise((resolve, reject) => {
      this._Model.findById(id, (err, model) => {
        if (err) reject(err);

        resolve(model);
      });
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this._Model.findByIdAndDelete(id, (err, model) => {
        if (err) reject(err);
        resolve(model);
      });
    })
  }

  async update(id) {
    return new Promise((resolve, reject) => {
      this._Model.findByIdAndUpdate(id, (err, model) => {
        if (err) reject(err);
        resolve(model);
      });
    })
  }

  async create(props) {
    return new this._Model(props).save();
  }
}
