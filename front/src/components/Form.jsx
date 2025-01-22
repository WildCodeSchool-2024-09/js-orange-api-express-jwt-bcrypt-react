import axios from 'axios';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Form = ({ login }) => {
  const [files, setFiles] = useState([]);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('file', files[0]);
    formData.append('login', login);

    await axios.post('http://localhost:3001/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: 10 }}>
      {files.length > 0 ||
        (user?.image && (
          <div>
            <img
              height={100}
              src={
                user?.image
                  ? `http://localhost:3001/uploads/${user?.image}`
                  : URL.createObjectURL(files[0])
              }
              alt="Mon avatar"
            />
          </div>
        ))}
      <div>
        <input
          type="file"
          name="inputFile"
          onChange={(e) => setFiles(e.target.files)}
        />
      </div>
      <div>
        <button>Envoyer</button>
      </div>
    </form>
  );
};

export default Form;
