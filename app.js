const express = require("express");
require("dotenv").config();

const app = express();

const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const { validateMovie, validateUser } = require("./validators");
const { hashPassword, verifyPassword } = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUser);
app.get("/api/users/:id", userHandlers.getUserById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post("/api/movies", validateMovie, movieHandlers.messagePost);
app.post("/api/users", validateUser, hashPassword, userHandlers.addingUser);

app.put(`/api/movies/:id`, validateMovie, movieHandlers.modifyMovie);
app.put(`/api/users/:id`, validateUser, hashPassword, userHandlers.modifyUser);

app.delete(`/api/movies/:id`, movieHandlers.deleteMovie);
app.delete(`/api/users/:id`, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
