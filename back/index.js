const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send({ message: 'Ouai, nous sommes les musclés' });
});

app.post('/checkToekn', (req, res) => {});

app.post('/signin', (req, res) => {
  const { login, password } = req.body.values;

  // Crypter le mdp
  //const passwordCrypte = bcrypt.hashSync(password, 8);

  const passBDD = bcrypt.hashSync(password, 8);

  // Le premiere paramètre password est le pass du user soumis
  // Le second parametre est son mdp sauvegardé et crypter quand il a crée son compte
  const passwordIsValid = bcrypt.compareSync(password, passBDD);

  if (passwordIsValid) {
    const token = jwt.sign({ login: login }, 'yavuzsecret', {
      expiresIn: '2 days',
    });
    res.send({ token: token });
  } else {
    res.send({ token: '' });
  }
});

app.listen(3001, () =>
  console.log('salut les musclés on se retrouve sur http://localhost:3001')
);

module.exports = app;
