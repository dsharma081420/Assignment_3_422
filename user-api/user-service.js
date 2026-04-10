const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  password: String,
  favourites: [String],
});

let User;

module.exports.connect = function () {
  return new Promise(function (resolve, reject) {
    const db = mongoose.createConnection(process.env.MONGO_URL);
    db.on("error", (err) => reject(err));
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
      return;
    }
    bcrypt.hash(userData.password, 10).then((hash) => {
      const newUser = new User({ userName: userData.userName, password: hash });
      newUser.save()
        .then(() => resolve("User " + userData.userName + " successfully registered"))
        .catch((err) => {
          if (err.code === 11000) {
            reject("User Name already taken");
          } else {
            reject("There was an error creating the user: " + err);
          }
        });
    });
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.findOne({ userName: userData.userName })
      .exec()
      .then((user) => {
        if (!user) { reject("Unable to find user: " + userData.userName); return; }
        bcrypt.compare(userData.password, user.password).then((result) => {
          if (result) { resolve(user); }
          else { reject("Incorrect password for user: " + userData.userName); }
        });
      })
      .catch(() => reject("Unable to find user: " + userData.userName));
  });
};

module.exports.getFavourites = function (id) {
  return new Promise(function (resolve, reject) {
    User.findById(id).exec()
      .then((user) => resolve(user.favourites))
      .catch(() => reject("Unable to get favourites for user with id: " + id));
  });
};

module.exports.addFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(id, { $addToSet: { favourites: favId } }, { new: true }).exec()
      .then((user) => resolve(user.favourites))
      .catch(() => reject("Unable to update favourites for user with id: " + id));
  });
};

module.exports.removeFavourite = function (id, favId) {
  return new Promise(function (resolve, reject) {
    User.findByIdAndUpdate(id, { $pull: { favourites: favId } }, { new: true }).exec()
      .then((user) => resolve(user.favourites))
      .catch(() => reject("Unable to update favourites for user with id: " + id));
  });
};
