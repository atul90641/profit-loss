// DataDisplay.js
import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

const DataDisplay = ({ data }) => {
  const [dataVisible, setDataVisible] = useState(true);

  // Assuming the first row contains the column headers
  const columns = data[0];

  const toggleDataVisibility = () => {
    setDataVisible((prevDataVisible) => !prevDataVisible);
  };

  return (
    <div className="data-display">
      <h2>
        Data from Excel: {' '}
        <button className='sign' onClick={toggleDataVisibility}>
          {dataVisible ? '-' : '+'}
        </button>
      </h2>
      {dataVisible && (
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DataDisplay;
