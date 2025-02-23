const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// Connection à Mysql
const { db } = require('./config/db');
const { checkUser, checkPassword, checkToken } = require('./middlewares/auth');
const fileUpload = require('./middlewares/multer');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));

app.get('/', (req, res) => {
  res.send({ message: 'Ouai, nous sommes les musclés' });
});

app.post('/image', [fileUpload], async (req, res) => {
  if (!req.file) {
    return res.send({
      error: 'Aucun fichier envoyé ou type de fichier non supporté.',
    });
  }

  console.log(req.body.login);
  const [rows, fields] = await db.query(
    `UPDATE users SET image='${req.file.filename}' WHERE login='${req.body.login}'`
  );

  return res.send({
    message: 'Hamdulilah, tout va bien',
    file: `/uploads/${req.file.filename}`,
  });
});

app.post('/signin', [checkUser, checkPassword], async (req, res) => {
  const { login } = req.body.values;

  try {
    const token = jwt.sign({ login: login }, process.env.SECRET, {
      expiresIn: '2 days',
    });

    const [rows, fields] = await db.query(
      `SELECT * FROM users WHERE login='${login}'`
    );

    const user = {
      id: rows[0].id,
      name: rows[0].name,
      login: rows[0].login,
      image: rows[0].image,
    };

    res.send({ user: user, token: token });
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
    // $2a$08$c/QeP4Snn.19k2s3h/PHfOcOjsQt3CnHXLp70Uyd3hvcUciafPVf6

    const result = await db.query(
      `INSERT INTO users  (name,login,password) VALUES ('${login}','${login}','${passBDD}')`
    );

    return res.send({ message: 'Hola', user: true });
  } catch (e) {
    console.log(e.message);
    res.send({ message: 'Erreur technique' });
  }
});

app.get('/check', [checkToken], async (req, res) => {
  return res.send({ check: true });
});

app.listen(3001, () =>
  console.log('salut les musclés on se retrouve sur http://localhost:3001')
);

module.exports = app;
