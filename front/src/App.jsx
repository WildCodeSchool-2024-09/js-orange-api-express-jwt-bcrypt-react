import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [type, setType] = useState('password');
  const [isAuth, setIsAuth] = useState(false);
  const [message, setMessage] = useState();

  const handleRegister = async () => {
    if (login === null || password === null) {
      setMessage('Veuillez saisir les datas');
      return;
    }

    const values = { login: login, password: password };

    const { data } = await axios.post('http://localhost:3001/signup', {
      method: 'POST',
      values: values,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(data);

    if (data?.message && data?.user) {
      setMessage(data?.message);
    } else {
      setMessage(data?.message);
    }
  };

  const handleLogin = async () => {
    if (login === null || password === null) {
      setMessage('Veuillez saisir les datas');
      return;
    }

    const values = { login: login, password: password };
    const { data } = await axios.post('http://localhost:3001/signin', {
      method: 'POST',
      values: values,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (data?.token) {
      setIsAuth(true);
      localStorage.setItem('tokenClement', data?.token);
    } else {
      setIsAuth(false);
      setMessage('Password erronné');
    }
  };

  return (
    <>
      {isAuth ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Je suis connecté en tant que {login}</div>
          <div>
            <button onClick={() => setIsAuth(false)}>Je me déconnecte</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Login</div>
          {message && <div style={{ color: 'red' }}>{message}</div>}
          <div>
            <input
              type="text"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <input
              type={type}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => setType(type === 'password' ? 'text' : 'password')}
            >
              {type === 'password' ? 'Affciher' : 'Cacher'} mon mot de passe
            </button>
          </div>
          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={handleLogin}>Je me connecte</button>
            <button onClick={handleRegister}>Je crée mon compte</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
