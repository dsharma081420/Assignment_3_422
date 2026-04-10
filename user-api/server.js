const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const userService = require("./user-service.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

const JwtStrategy = passportJWT.Strategy;

function jwtFromAuthorizationHeader(req) {
  if (!req?.headers?.authorization) return null;
  const [scheme, token] = req.headers.authorization.split(" ");
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "jwt") return null;
  return token;
}

const jwtOptions = {
  // Accept "Authorization: JWT <token>" (per assignment spec), case-insensitive.
  jwtFromRequest: jwtFromAuthorizationHeader,
  secretOrKey: process.env.JWT_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  if (jwt_payload) {
    next(null, { _id: jwt_payload._id, userName: jwt_payload.userName });
  } else {
    next(null, false);
  }
});

passport.use(strategy);
app.use(passport.initialize());

// Root — browsers hitting the deployment URL see this instead of "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    message: "WEB422 User API is running",
    base: "/api/user",
    routes: {
      register: "POST /api/user/register",
      login: "POST /api/user/login",
      favourites: "GET /api/user/favourites (Authorization: JWT <token>)",
      addFavourite: "PUT /api/user/favourites/:id (Authorization: JWT <token>)",
      removeFavourite: "DELETE /api/user/favourites/:id (Authorization: JWT <token>)",
    },
  });
});

// POST /api/user/register
app.post("/api/user/register", (req, res) => {
  userService
    .registerUser(req.body)
    .then((msg) => res.json({ message: msg }))
    .catch((msg) => res.status(422).json({ message: msg }));
});

// POST /api/user/login
app.post("/api/user/login", (req, res) => {
  userService
    .checkUser(req.body)
    .then((user) => {
      const payload = {
        _id: user._id,
        userName: user.userName,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.json({ message: "login successful", token: token });
    })
    .catch((msg) => res.status(422).json({ message: msg }));
});

// GET /api/user/favourites  - PROTECTED
app.get(
  "/api/user/favourites",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .getFavourites(req.user._id)
      .then((data) => res.json(data))
      .catch((err) => res.status(422).json({ error: err }));
  }
);

// PUT /api/user/favourites/:id  - PROTECTED
app.put(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .addFavourite(req.user._id, req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(422).json({ error: err }));
  }
);

// DELETE /api/user/favourites/:id  - PROTECTED
app.delete(
  "/api/user/favourites/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userService
      .removeFavourite(req.user._id, req.params.id)
      .then((data) => res.json(data))
      .catch((err) => res.status(422).json({ error: err }));
  }
);

// Vercel (@vercel/node) expects the Express app to be exported — it does not use app.listen().
// Local dev: connect to MongoDB then listen on PORT.
if (require.main === module) {
  userService
    .connect()
    .then(() => {
      app.listen(HTTP_PORT, () => {
        console.log("API listening on: " + HTTP_PORT);
      });
    })
    .catch((err) => {
      console.log("unable to start the server: " + err);
      process.exit();
    });
} else {
  userService.connect().catch((err) => {
    console.log("unable to connect to MongoDB: " + err);
  });
}

module.exports = app;
