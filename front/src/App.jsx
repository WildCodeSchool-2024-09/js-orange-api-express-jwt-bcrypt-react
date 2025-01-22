import { useState } from 'react';
import './App.css';
import { useAuth } from './hooks/useAuth';
import Form from './components/Form';

function App() {
  const { handleLogin, handleRegister, handleLogout, isAuth, message } =
    useAuth();
  const [filesDisplay, setFilesDisplay] = useState([]);
  const [login, setLogin] = useState(null);
  const [password, setPassword] = useState(null);
  const [type, setType] = useState('password');

  return (
    <>
      {isAuth ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>Je suis connecté en tant que {login}</div>
          <Form setFilesDisplay={setFilesDisplay} />
          {filesDisplay.map((picture) => (
            <div key={picture.id} className="d-flex flex-column">
              <img
                src={picture.file_name}
                alt={picture.name}
                className="img-thumbnail m-2"
                style={{ height: '100px' }}
              />
              <button
                data-id={picture.id}
                onClick={handleDelete}
                className="btn btn-danger mx-3"
              >
                Supprimer
              </button>
            </div>
          ))}
          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={handleLogout}>Je me déconnecte</button>
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
              {type === 'password' ? 'Afficher' : 'Cacher'} mon mot de passe
            </button>
          </div>
          <div>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={() => handleLogin(login, password)}>
              Je me connecte
            </button>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button onClick={() => handleRegister(login, password)}>
              Je crée mon compte
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
