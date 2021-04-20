const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const User = require("../models/user");
const jwt = require("jsonwebtoken");

passport.use(
  new BearerStrategy(async (token, done) => {
    const tokenData = await jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const user = await User.findOne({ _id: tokenData._id });
    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
);
