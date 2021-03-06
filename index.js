const express = require("express");
const app = express();
const morgan = require("morgan");

let movieList = {
    results : [
    { name : "Lost in Translation",
      endpoint : "/movies/Lost%20In%20Translation",
      images : "img/lostintranslation.png"
    },

    { name : "The Martian",
      endpoint : "/movies/The%20Martian",
      images : "img/themartian.png"
    },

    { name : "Inside Llewyn Davis",
      endpoint : "/movies/Inside%Llewyn%Davis",
      images : "img/insidellewyindavis.png"
    },

    { name : "Django Unchained",
      endpoint : "/movies/Django%Unchained",
      images : "img/djangounchained.png"
    }
      ]
}

let movies = [{
    name : "Lost in Translation",
    director : ["Sofia Coppola"],
    year : 2003,
    cast : ["Bill Murray", "Scarlett Johannson", "Giovanni Ribisi", "Anna Faris"],
    genre : ["Comedy", "Romance", "Drama"],
},
{
    name : "The Martian",
    director : ["Ridley Scott"],
    year : 2015,
    cast : ["Matt Damon", "Jessica Chastain", "Kristen Wiig", "Jeff Daniels", "Michael Peña"],
    genre : ["Science Fiction", "Drama"],
},
{
    name : "Inside Llewyn Davis",
    director : ["Ethan Coen", "Joel Coen"],
    year : 2013,
    cast : ["Oscar Isaac", "Carey Mulligan", "Johan Doodman", "Garrett Hedlund", "Justin Timberlake", "Adam Driver"],
    genre : ["Drama"],
},
{
    name : "Django Unchained",
    director : ["Quentin Tarantino"],
    year : 2012,
    cast : ["Jamie Foxx", "Christoph Walz", "Kerry Washingtom", "Leonardo DiCaprio", "Samuel L. Jackson"],
    genre : ["Western", "Drama"],
},
{
    name : "Interstellar",
    director : "Christopher Nolan",
    year : 2014,
    cast : ["Matthew McConaughey", "Jessica Chastain", "Casey Affleck", "Anne Hathaway", "Matt Damon", "Michael Caine"],
    genre : ["Science Fiction", "Drama"],
},
{
    name : "Portrait of a Lady on Fire",
    director : "Céline Sciamma",
    year : 2019,
    cast : ["Noémie Merlant", "Adèle Haenel", "Luàna Bajrami", "Valeria Golino"],
    genre : ["Drama", "Romance"],
},
{
    name : "Office Space",
    director : "Mike Judge",
    year : 1999,
    cast : ["Ron Livingston", "Jennifer Aniston", "David Herman", "Ajay Naidu", "Diedrich Bader", "John C. McGinley"],
    genre : ["Comedy"],
},
{
    name : "Everything is Illuminated",
    director : "Liev Schreiber",
    year : 2005,
    cast : ["Elijah Wood", "Eugene Hutz", "Boris Leskin", "Jana Hrabětova", "Jonathan Safran Foer"],
    genre : ["Drama", "Comedy"],
},
{
    name : "Lord of the Rings",
    director : "Peter Jackson",
    year : 2001,
    cast : ["Elijah Wood", "Viggo Mortensen", "Sean Astin", "Orlando Bllom", "Ian McKellen", "Liv Tyler", "Christopher Lee"],
    genre : ["Fantasy", "Action"],
},
{
    name : "Young Adult",
    director : "Jason Reitman",
    year : 2011,
    cast : ["Charlize Theron", "Pattom Oswalt", "Patrick Wilson", "Elizabeth Reaser"],
    genre : ["Comedy", "Drama"],
}]


// Declare Middleware functions
let requestTime = (req, res, next) => {
    let timeNow = new Date(Date.now());
    req.requestTime = timeNow.toUTCString();
    console.log(req.requestTime);
    next();
};


// Execute Middleware functions
app.use(morgan("common"));
app.use(requestTime);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something wen wrong!');
  });
app.use(express.static('public'));


// HTTP requests
app.get("/", (req, res) => {
    res.send("Welcome to myFlix API")
});

app.get("/movies", (req, res) => {
    res.json(movieList)
});

app.get("/movies/:title", (req, res) => {
    let reqMovie = req.params.title;
    console.log(reqMovie);
    res.json(movies.find((object) => {
        return object.name === reqMovie
    }));
});

app.get("/genres/:Name", (req, res) => {
    res.send("JSON object of data for genre of sepecified name")
});

app.get("/directors/:Name", (req, res) => {
    let reqDirector = req.params.Name;
    res.send(`JSON object of data for ${reqDirector}`)
})

app.post("/users", (req, res) => {
    let newUser = req.body;
    res.send("You're successfully regitered.")
})

app.put("/users/:Username", (req, res) => {
    let newUsername = req.params.Username
    res.send("Your username has been successfully updated.")
})

app.put("/favorits/:Title", (req, res) => {
    let newFavorite = req.params.Title
    res.send("Your movies has been successfully added to your favorites.")
})

app.delete("/favorits/:Title", (req, res) => {
    let newFavorite = req.params.Title
    res.send("Your movies has been successfully deleted from your favorites.")
})

app.delete("/users/:Username", (req, res) => {
    let newFavorite = req.params.Username
    res.send("Your account has successfully been deleted")
})


app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});