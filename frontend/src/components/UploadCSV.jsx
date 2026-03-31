import React, { useState, useRef } from 'react';
import axios from 'axios';

const UploadCSV = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage({ type: '', text: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post('http://localhost:8000/api/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: 'CSV uploaded successfully!' });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      onUploadSuccess();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      setMessage({ type: 'error', text: 'Failed to upload CSV. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        ref={fileInputRef}
        className="file-input"
        id="csv-upload"
      />
      <label htmlFor="csv-upload" className="btn file-btn">
        {file ? file.name : 'Select CSV File'}
      </label>
      <button 
        className="btn upload-btn" 
        onClick={handleUpload} 
        disabled={!file || loading}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {message.text && (
        <span className={`upload-msg msg-${message.type}`}>
          {message.text}
        </span>
      )}
    </div>
  );
};

export default UploadCSV;
