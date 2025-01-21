/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [message, setMessage] = useState();

  const handleRegister = async (login, password) => {
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

  const handleLogin = async (login, password) => {
    if (login === null || password === null) {
      //setMessage('Veuillez saisir les datas');
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
      setMessage(data?.message || 'Password erronné');
    }
  };

  const handleLogout = async () => {
    await handleClean();
  };

  const currentUser = async () => {
    const token = localStorage.getItem('tokenClement');

    if (token) {
      // Test de connexion back
      const { data } = await axios.get('http://localhost:3001/check', {
        headers: { token: token },
      });

      setIsAuth(data?.check);
      if (!data?.check) {
        await handleClean();
      }
    } else {
      await handleClean();
    }
  };

  const handleClean = async () => {
    localStorage.removeItem('tokenClement');
    setIsAuth(false);
  };

  useEffect(() => {
    currentUser();
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ handleLogin, handleRegister, handleLogout, isAuth, message }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error('Pour utiliser useAuth context est necessaire');
  return context;
};
