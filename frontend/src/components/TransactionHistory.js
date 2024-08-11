import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";


// Fill with real date for second assingment
const Record = ({ record }) => (
  <tr>
    <td>{record.Date}</td>
    <td>{record.Time}</td>
    <td>{record.AccountType}</td>
    <td>{record.AmountSent}</td>
  </tr>
);

const RecordInteral = ({ record }) => (
  <tr>
    <td>{record.Date}</td>
    <td>{record.Time}</td>
    <td>{record.SendingAccount}</td>
    <td>{record.RecievingAccount}</td>
    <td>{record.AmountSent}</td>
  </tr>
);

const RecordExternal = ({ record }) => (
  <tr>
    <td>{record.Date}</td>
    <td>{record.Time}</td>
    <td>{record.SendingAccountNumber}</td>
    <td>{record.SendingAccount}</td>
    <td>{record.RecievingAccountNumber}</td>
    <td>{record.RecievingAccount}</td>
    <td>{record.AmountSent}</td>
  </tr>
);

export default function Records() {
  const [records, setRecords] = useState([]);
  const {accountNumber} = useParams();


  const [transacationType, setTransactionType] = useState("Direct")

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/transaction/list/${accountNumber}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const fetchedRecords = await response.json();
      setRecords(fetchedRecords);
    }

    getRecords();
  }, []);
  let filter = records.filter(record => record.Type === transacationType)

  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h2 className="pl-3">Transaction History </h2></li>
        </ul>
        <h4 className="pl-3">Select Transaction Type</h4>
        <button onClick={() => setTransactionType("Direct")}>Direct</button>
        <button onClick={() => setTransactionType("Internal")}>Internal</button>
        <button onClick={() => setTransactionType("External")}>External</button>

        <br />
        {transacationType === "Direct" &&
          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Account</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {records ? (
                  filter.map((record, index) => <Record key={index} record={record} />)
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button><Link to={-1} style={{ textDecoration: 'none', color: 'inherit' }}>Go Back</Link></button> 
          </div>}
        {transacationType === "Internal" &&
          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {records ? (
                  filter.map((record, index) => <RecordInteral key={index} record={record} />)
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button><Link to={-1} style={{ textDecoration: 'none', color: 'inherit' }}>Go Back</Link></button> 
          </div>}
          {transacationType === "External" &&
          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Sending Account Number</th>
                  <th>Sending Account Type</th>
                  <th>Recieving Account Number</th>
                  <th>Recieving Account Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {records ? (
                  filter.map((record, index) => <RecordExternal key={index} record={record} />)
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
            <button><Link to={-1} style={{ textDecoration: 'none', color: 'inherit' }}>Go Back</Link></button> 
          </div>}
      </div>

    </div>
  );
}

