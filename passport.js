const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Models = require("./models.js");
const passportJWT = require("passport-jwt");

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({

    usernameField: 'Username',
    passwordField: 'Password'
  },
  (username, password, done) => 
  {
    console.log(username + '  ' + password);
    Users.findOne({Username: username}, (err, user) =>
    {
        if (err)
        {
            console.log(err);
            return done(err)
        }

        if (!user)
        {
            console.log("username not found");
            return done(null, false, {message: 'Incorrect username.'})
        }

        if (!user.validatePassword(password))
        {
          console.log("Incorrect password.");
          return done(null, false, {message: 'Incorrect password.'})
        }

        if (user)
        {
            console.log('finished');
            return done(null, user);
        }
    })
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret'
  },
  (jwtPayload, done) => 
  {
    return Users.findById(jwtPayload._id).then((user) =>
    {
        return done(null, user);
    }).catch((err) =>
    {
        console.log(err);
        return done(err)
    });
  }));