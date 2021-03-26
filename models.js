const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema(
{
   Title : {type: String, required: true},
   Description : {type: String, required: true},
   Director : {
      Name : String,
      Bio : String,
      Birth : Date
   },
   Year : Number,
   Genre : {
      Name : String,
      Description : String
   },
   Actors : [String],
   ImageUrl : String,
   Featured : Boolean
})

let userSchema = mongoose.Schema(
{
    Name: {type: String, required: true},
    Username: {type: String, required: true},
    Email: {type: String, required: true},
    Password: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
})

userSchema.statics.hashPassword = (password) => {
   return bcrypt.hashSync(password, 10);
 };
 
 userSchema.methods.validatePassword = function(password) {
   return bcrypt.compareSync(password, this.Password);
 };

let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema)

module.exports.Movie = Movie;
module.exports.User = User;