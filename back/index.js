const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Connection à Mysql
const { db } = require('./config/db');
const { checkUser, checkPassword } = require('./middlewares/auth');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ message: 'Ouai, nous sommes les musclés' });
});

app.post('/signin', [checkUser, checkPassword], async (req, res) => {
  const { login } = req.body.values;

  try {
    const token = jwt.sign({ login: login }, 'yavuzsecret', {
      expiresIn: '2 days',
    });
    res.send({ token: token });
  } catch (e) {
    console.log(e.message);
    res.send({ message: 'Erreur technique' });
  }
});

app.post('/signup', async (req, res) => {
  const { login, password } = req.body.values;

  try {
    const [rows, fields] = await db.query(
      `SELECT * FROM users WHERE login='${login}'`
    );

    if (rows.length === 1) {
      return res.send({
        message: 'le compte existe, veuillez vous connecter',
        user: false,
      });
    }

    const passBDD = bcrypt.hashSync(password, 8);

    const result = await db.query(
      `INSERT INTO users  (name,login,password) VALUES ('${login}','${login}','${passBDD}')`
    );

    console.log(result);
    return res.send({ message: 'Hola', user: true });
  } catch (e) {
    console.log(e.message);
    res.send({ message: 'Erreur technique' });
  }
});

app.listen(3001, () =>
  console.log('salut les musclés on se retrouve sur http://localhost:3001')
);

module.exports = app;
