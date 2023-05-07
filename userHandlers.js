const database = require("./database");

const getUser = (req, res) => {
  const initialSql = "SELECT * FROM users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([user]) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users where id = ?", [id])
    .then(([user]) => {
      if (user[0] != null) {
        res.status(200).json(user[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const addingUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving user");
    });
};

const modifyUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "UPDATE users SET firstname=?, lastname=?, email=?, city=?, language=? WHERE id=?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows !== 0) {
        res.sendStatus(204);
      } else {
        res.status(404).send("User not found...");
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error while updating user");
    });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("User not found...");
      } else {
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error while deleting user");
    });
};

module.exports = {
  getUser,
  getUserById,
  addingUser,
  modifyUser,
  deleteUser,
};
