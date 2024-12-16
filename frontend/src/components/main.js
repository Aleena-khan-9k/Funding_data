import React, { useState } from 'react';
import axios from 'axios';

function UploadData() {
  const [file, setFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({ organization_name: '', website: '' });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:2000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setLoading(false);
      alert('File uploaded successfully!');
      setTableData(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
      alert('Failed to upload file.');
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:2000/api/search', searchQuery);
      setTableData(response.data.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      alert('Failed to fetch filtered data. Please try again.');
    }
  };

  const handleExport = async () => {
    try {
      // Send filters with the request
      const response = await axios.get('http://localhost:2000/api/export', {
        params: { 
          organization_name: searchQuery.organization_name, 
          website: searchQuery.website 
        },
        responseType: 'blob', // Ensure the response is handled as a blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exported_data.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        /* Apply gradient to the entire page */
html, body {
  margin: 0;
  height: 100%; 
  background:rgb(32, 226, 210);
  background-size: cover;
  background-attachment: fixed; /* Keeps the background fixed during scroll */
  
}

.container {
  display: flex;
  min-height: 100vh; /* Ensure container takes full height */
  width: 100%;
}

.sidebar {
  width: 15%;
  background-color: white; /* Slight transparency for blending */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.sidebar button {
  margin: 10px 0;
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 34px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease; /* Add transition for transform and shadow */
}

/* Hover state with animation */
.sidebar button:hover {
  background-color:rgb(15, 217, 224);
  color: white; /* Optional: Change text color */
  transform: translateY(-5px); /* Slightly lift the button */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Add shadow for depth */
}
.main-content {
  flex: 1;
  padding: 20px;
  color: #fff; /* Ensure text is readable on the dark background */
}

.search-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%; /* Ensure the section takes the full width */
}

.search-section textarea,
.search-section input {
  flex: 1; /* Allow input and textarea to take equal space */
  padding: 12px 20px; /* Increase padding for better appearance */
  border-radius: 20px; /* Make the fields oval-shaped */
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333; /* Ensure text is readable */
  font-size: 16px; /* Set font size for readability */
  margin-right: 10px; /* Space between input fields */
  transition: border-color 0.3s ease; /* Smooth transition for focus */
}

/* Optional: Adjust the width of the text area */
.search-section textarea {
  resize: none; /* Prevent resizing */
}

.search-section textarea:focus,
.search-section input:focus {
  border-color: rgb(3, 17, 65); /* Change border color on focus */
  outline: none; /* Remove default outline */
}

.search-section input:last-child {
  margin-right: 0; /* Remove right margin from the last input */
}
.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  color: black;
}



      `}</style>

      <div className="container">
        <div className="sidebar">
          <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
          <button onClick={() => document.getElementById('fileInput').click()}>Choose File</button>
          <button onClick={handleFileUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Data'}
          </button>
          <button onClick={handleSearch}>Filter</button>
          <button onClick={handleExport}>Export Data</button>
        </div>

        <div className="main-content">
          <div className="search-section">
            <textarea
              name="organization_name"
              value={searchQuery.organization_name}
              onChange={handleSearchChange}
              placeholder="Search by company name"
            />
            <input
              type="text"
              name="website"
              value={searchQuery.website}
              onChange={handleSearchChange}
              placeholder="Search by Website"
            />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Organization Name</th>
                  <th>Website</th>
                  <th>Number of Employees</th>
                  <th>Estimated Revenue</th>
                  <th>Contact Name</th>
                  <th>Contact Title</th>
                  <th>Industries</th>
                  <th>Headquarters</th>
                  <th>LinkedIn</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.organization_name}</td>
                      <td>{row.website}</td>
                      <td>{row.number_of_employees}</td>
                      <td>{row.estimated_revenue_range}</td>
                      <td>{row.contact_name}</td>
                      <td>{row.contact_title}</td>
                      <td>{row.industries}</td>
                      <td>{row.headquarters_location}</td>
                      <td>{row.linkedin_url}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadData;
