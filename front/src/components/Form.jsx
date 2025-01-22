import { useState } from 'react';
import axios from 'axios';

function Form({ setFilesDisplay }) {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const handleForm = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('file', files[0]);
    formData.append('name', name);

    const data = await axios
      .post('http://localhost:3001/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => setFilesDisplay([]));

    console.log(data);
  };

  return (
    <form onSubmit={handleForm} className="w-40">
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            height: '12rem',
            backgroundColor: 'lightgray',
            marginBottom: '1rem',
          }}
        >
          {files.length > 0 && (
            <img
              style={{ height: '12rem' }}
              src={URL.createObjectURL(files[0])}
            />
          )}
        </div>
      </div>
      <div className="form-group mb-2">
        <label htmlFor="inputName">Nom</label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          name="inputName"
          type="text"
        />
      </div>
      <div className="form-group mb-4">
        <label htmlFor="inputFile">Image</label>
        <br />
        <input
          onChange={(e) => setFiles(e.target.files)}
          className="form-control-file"
          name="inputFile"
          type="file"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Envoyer
      </button>
    </form>
  );
}

export default Form;
