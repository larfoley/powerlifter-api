module.exports = class Service {
  constructor(model) {
    this._Model = model
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this._Model.find({}, (err, users) => {
        if (err) reject(err);
        resolve({ users });
      });
    })
  }

  async find(id) {
    return new Promise((resolve, reject) => {
      this._Model.findById(id, (err, user) => {
        if (err) reject(err);

        this._Model.getFriends(user, (err, friends) => {
          if (err) reject(err);

          user.friends = friends;
          resolve({ user });
        });
      });
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      this._Model.findByIdAndDelete(id, (err, user) => {
        if (err) reject(err);
        resolve({ user });
      });
    })
  }

  async create(props) {
    return new this._Model(props).save();
    // return new Promise((resolve, reject) => {
    //     const model = new this._Model(props);
    //
    //     model.save((err, user) => {
    //       if (err) reject(err);
    //       resolve(user)
    //     })
    // });
  }
}
