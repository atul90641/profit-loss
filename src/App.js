// App.js
import React, { useState } from 'react';
import FileInput from './FileInput';
import DataDisplay from './DataDisplay';
import { readExcel } from './utils';
import * as XLSX from 'xlsx';

function App() {
  const [excelData, setExcelData] = useState(null);
  const [result, setResult] = useState([]);
  let s = new Set();
  const handleFileSelect = (file) => {
    readExcel(file).then((data) => {
      setExcelData(data);
      simulateFinancialTransactions(data);
    });
  };

  const simulateFinancialTransactions = (data) => {
    let row = data.length;
    let fd = [];
    for (let i = 0; i < row; i++) {
      let temp = {
        date: data[i][0],
        coin: data[i][1], // Assuming the first column contains the coin data
        amount: data[i][2], // Assuming the,
        volume: data[i][3], // Assuming the
        total: data[i][4], // Assuming the
        type: data[i][5], // Assuming the,
      };
      fd.push(temp);
    }

    
    for (let data of fd) {
      s.add(data.coin);
    }
    let myArray = [];
    myArray = Array.from(s)
    myArray.sort()
    s.clear()
    s = new Set(myArray);

    let simulationResult = [];
    for (let i of s) {
      let matrix = [];
      let buy = [];
      let sell = [];
      for (let j = 0; j < row; j++) {
        if (fd[j].coin === i) matrix.push(fd[j]);
      }
      for (let data of matrix) {
        if (data.type === 'Buy') buy.push(data);
        else sell.push(data);
      }
      while (sell.length > 0 && buy.length > 0) {
        let b_size = buy.length - 1;
        let s_size = sell.length - 1;
        if (buy[b_size].volume > sell[s_size].volume) {
          buy[b_size].volume -= sell[s_size].volume;
          simulationResult.push({
            date: buy[b_size].date,
            amount: buy[b_size].amount,
            volume: sell[s_size].volume,
            total: buy[b_size].amount * sell[s_size].volume,
            type: 'Buy',
            coin: i,
          });
          simulationResult.push({
            date: sell[s_size].date,
            amount: sell[s_size].amount,
            volume: sell[s_size].volume,
            total: sell[s_size].amount * sell[s_size].volume,
            type: 'Sell',
            coin: i,
          });
          sell.pop();
        } else if (buy[b_size].volume < sell[s_size].volume) {
          sell[s_size].volume -= buy[b_size].volume;
          simulationResult.push({
            date: buy[b_size].date,
            amount: buy[b_size].amount,
            volume: buy[b_size].volume,
            total: buy[b_size].amount * buy[b_size].volume,
            type: 'Buy',
            coin: i,
          });
          simulationResult.push({
            date: sell[s_size].date,
            amount: sell[s_size].amount,
            volume: buy[b_size].volume,
            total: sell[s_size].amount * buy[b_size].volume,
            type: 'Sell',
            coin: i,
          });
          buy.pop();
        } else {
          simulationResult.push({
            date: buy[b_size].date,
            amount: buy[b_size].amount,
            volume: buy[b_size].volume,
            total: buy[b_size].amount * buy[b_size].volume,
            type: 'Buy',
            coin: i,
          });
          simulationResult.push({
            date: sell[s_size].date,
            amount: sell[s_size].amount,
            volume: sell[s_size].volume,
            total: sell[s_size].amount * sell[s_size].volume,
            type: 'Sell',
            coin: i,
          });
          buy.pop();
          sell.pop();
        }
      }
      while (buy.length > 0) {
        let b_size = buy.length - 1;
        simulationResult.push({
          date: buy[b_size].date,
          amount: buy[b_size].amount,
          volume: buy[b_size].volume,
          total: buy[b_size].amount * buy[b_size].volume,
          type: 'Buy',
          coin: i,
        });
        buy.pop();
      }
      while (sell.length > 0) {
        let s_size = sell.length - 1;
        simulationResult.push({
          date: sell[s_size].date,
          amount: sell[s_size].amount,
          volume: sell[s_size].volume,
          total: sell[s_size].amount * sell[s_size].volume,
          type: 'Sell',
          coin: i,
        });
        sell.pop();
      }
    }

    setResult(simulationResult);
  };

  const handleExportClick = () => {
    // Check if there are results to export
    if (result.length === 0) {
      alert('No data to export.');
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(result);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'FinancialResults');

    // Save the workbook to a file
    XLSX.writeFile(wb, 'FinancialResults.xlsx');
  };
  const coinColors = ['#3CB371', '#fcdce8', '#fe7133', '#6897bb']; // Add more colors as needed
  let colorIndex = 0;
  const getNextColor = () => {
    const color = coinColors[colorIndex];
    colorIndex = (colorIndex + 1) % coinColors.length; // Loop back to the beginning if colors are exhausted
    return color;
  };

  let currentCoin = "None";
  let currentCoinColor = coinColors[0];
  const changing = (coin) => {
    // Check if the coin type has changed
    if (coin !== currentCoin) {
      currentCoin = coin;
      currentCoinColor = getNextColor(); // Reset color index for the new coin type
    }
  
    return currentCoinColor;
  };
  return (
    <div className="container">
      <h1>Profit-Loss App</h1>
      <FileInput onFileSelect={handleFileSelect} />
      {excelData && <DataDisplay data={excelData} />}
      {result.length > 0 && (
        <div>
          <div className='box'>
          </div>
          <h2>Financial Transactions Result:</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Volume</th>
                <th>Total</th>
                <th>Type</th>
                <th>Coin</th>
              </tr>
            </thead>
            <tbody>
              {result.map((data, index) => (
                <tr key={index} style={{ backgroundColor: changing(data.coin) }}>
                  <td>{data.date}</td>
                  <td>{data.amount}</td>
                  <td>{data.volume}</td>
                  <td>{data.total}</td>
                  <td>{data.type}</td>
                  <td>{data.coin}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="button" onClick={handleExportClick}>Export to Excel</button>
        </div>
      )}
    </div>
  );
}

export default App;
