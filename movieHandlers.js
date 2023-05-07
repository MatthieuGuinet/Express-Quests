const database = require("./database");

const getMovies = (req, res) => {
  let sql = "SELECT * FROM movies";
  const sqlValues = [];

  if (req.query.color != null) {
    sql += " WHERE color=?";
    sqlValues.push(req.query.color);

    if (req.query.max_duration != null) {
      sql += " AND duration <= ?";
      sqlValues.push(req.query.max_duration);
    }
  } else if (req.query.max_duration != null) {
    sql += " WHERE duration <= ?";
    sqlValues.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const messagePost = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const modifyMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "UPDATE movies SET title=?, director=?, year=?, color=?, duration=? WHERE id=?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows !== 0) {
        res.sendStatus(204);
      } else {
        res.status(404).send("Movie not found...");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error while updating movie");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM movies WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Movie not found...");
      } else {
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error while deleting movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  messagePost,
  modifyMovie,
  deleteMovie,
};
