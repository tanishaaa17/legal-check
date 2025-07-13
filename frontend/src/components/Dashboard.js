import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const Dashboard = ({ user, onLogout }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setSuccess('');
    } else {
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/upload-pdf`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSimplifiedText(response.data.simplifiedText);
      setOriginalText(response.data.originalText);
      setSuccess(response.data.message);
      setSelectedFile(null);
      
      // Reset file input
      e.target.reset();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error processing PDF';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h1 className="form-title">Welcome to Legal Check Dashboard!</h1>
        
        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p><strong>Hello, {user.name}!</strong></p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* PDF Upload Form */}
        <div className="upload-section">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Upload Legal Document</h2>
          <p style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
            Upload a PDF legal document and we'll simplify it into plain English for you.
          </p>
          
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="pdfFile">Select PDF File</label>
              <input
                type="file"
                id="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                style={{
                  padding: '10px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  width: '100%'
                }}
              />
            </div>

            <button 
              type="submit" 
              className="btn" 
              disabled={uploading || !selectedFile}
              style={{ marginTop: '20px' }}
            >
              {uploading ? (
                <>
                  <span className="loading"></span>
                  Processing PDF...
                </>
              ) : (
                'Upload & Simplify'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {simplifiedText && (
          <div className="results-section" style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#333' }}>Simplified Legal Content</h3>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e1e5e9',
              marginBottom: '20px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <p style={{ lineHeight: '1.6', color: '#333' }}>{simplifiedText}</p>
            </div>

            <details style={{ marginTop: '20px' }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: '#667eea', 
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                View Original Text
              </summary>
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #e1e5e9',
                marginTop: '10px',
                maxHeight: '200px',
                overflowY: 'auto',
                fontSize: '14px',
                color: '#666'
              }}>
                <p style={{ lineHeight: '1.5' }}>{originalText}</p>
              </div>
            </details>
          </div>
        )}

        {/* Logout Button */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button className="btn" onClick={onLogout} style={{ background: '#dc3545' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 