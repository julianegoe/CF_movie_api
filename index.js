const express = require("express");
const Models = require("./models.js");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
require('./passport'); 

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect("mongodb://localhost:27017/myFlixDB", { useNewUrlParser: true, useUnifiedTopology: true });


// Declare Middleware function
let requestTime = (req, res, next) => {
    let timeNow = new Date(Date.now());
    req.requestTime = timeNow.toUTCString();
    console.log(req.requestTime);
    next();
};


// Execute Middleware functions
app.use(morgan("common"));
/* app.use(requestTime); */
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
app.use(express.static('public'));
let auth = require('./auth')(app);

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// HTTP requests
app.get("/", (req, res) => {
    res.send("Welcome to myFlix API")
});

app.get("/movies", passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get("/movies/:title", passport.authenticate('jwt', { session: false }), (req, res) => {
    let reqMovie = req.params.title;
    Movies.find({Title : reqMovie}).then((movie) => 
    {
        res.status(202).json(movie)
    }).catch((error) => 
    {
        console.log(error);
        res.status(500).send("Error: " + error)
    })
});

app.get("/genres/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
    let genre = req.params.name;
    Movies.findOne({"Genre.Name" : genre}).then((genreName) => 
    {
        res.status(202).json(genreName.Genre)
    }).catch((error) => 
    {
        console.log(error);
        res.status(500).send("Error 500: " + error)
    })
});

app.get("/directors/:name", passport.authenticate('jwt', { session: false }), (req, res) => {
    let director = req.params.name;
    Movies.findOne({"Director.Name" : director}).then((directorName) => 
    {
        res.status(202).json(directorName.Director)
    }).catch((error) => 
    {
        console.log(error);
        res.status(500).send("Error 500: " + error)
    })
});

app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
      let username = req.params.username;
    Users.findOne({"Username": username})
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.post("/users", 
check("Username", "Username is required").isLength({min:3}),
check("Password", "Password is required").not().isEmpty(),
check("Birthday", "Birthday must be a date").isDate(),
check("Email", "E-Mail does not appear to be valid").isEmail(),
(req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    let newUser = req.body;
    let hashedPassword = Users.hashPassword(newUser.Password);
    Users.findOne({"Username" : newUser.Username}).then((user) =>
    {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
    } else {
        Users.create(
            {
                Name: newUser.Name,
                Username: newUser.Username,
                Password: hashedPassword,
                Email: newUser.Email,
                Birthday: newUser.Birthday
            })
            .then((user) => {
                res.status(201).json(user)
            }).catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    }});
});

app.put("/users/:username", 
check("Password", "Password is required").not().isEmpty(),
passport.authenticate('jwt', { session: false }),
check("Username", "Username is required").isLength({min:3}),
check("Birthday", "Birthday must be a date").isDate(),
check("Email", "E-Mail does not appear to be valid").isEmail(),
(req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    let user = req.params.username;
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
        {
            Username : user
        },
        {
            $set: 
            {
                Name: req.body.Name,
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
        {
            new: true
        }
    ).then((updatedUser) => 
    {
        res.json(updatedUser)
    }).catch((err) => 
    {
        console.log(err);
        res.status(500).send("Error: " + err)
    })
});

app.put("/users/:username/movies/:movieId", passport.authenticate('jwt', { session: false }), (req, res) => {
    let newFavorite = req.params.movieId;
    let user = req.params.username;
    Users.findOneAndUpdate({Username: user},
    {
        $push: {
            FavoriteMovies : newFavorite
        }
    },
    { new: true }).then((updatedFav) => {
        res.json(updatedFav)
    }).catch((err) => 
    {
        console.log(err);
        res.status(500).send("Error: " + err)
    })
})

app.delete("/users/:username/movies/:movieId", passport.authenticate('jwt', { session: false }), (req, res) => {
    let favorite = req.params.movieId;
    let user = req.params.username;
    Users.findOneAndUpdate({Username: user}, 
    { $pull: 
        {
        FavoriteMovies : favorite
        }
}).then((user) => 
    {
        if (!user) 
        {
            res.status(400).send(req.params.username + ' was not found');
        } else 
        {
            res.status(200).send(req.params.movieId + ' was deleted.');
        }
    }).catch((error) => 
    {
        console.log(error);
        res.status(500).send("Error: " + error)
    })
})

app.delete("/users/:username", passport.authenticate('jwt', { session: false }), (req, res) => {
    let user = req.params.username;
    Users.findOneAndDelete({Username: user}).then((user) =>
    {
        if (!user) 
        {
            res.status(400).send(req.params.username + ' was not found');
        } else 
        {
            res.status(200).send(req.params.username + ' was deleted.');
        }
    }).catch((error) => 
    {
        console.log(error);
        res.status(500).send("Error: " + error)
    })
});


const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0",() => {
 console.log("Listening on Port  " + port);
});