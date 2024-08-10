import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = ({ record }) => (
  <tr>
    <td>{record.date}</td>
    <td>{record.time}</td>
    <td>{record.from}</td>
    <td>{record.to}</td>
    <td>{record.amount}</td>
  </tr>
);

export default function EmployeeTransactions() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5000/transactions/employee`, {
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

  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h3 className="pl-3">All Transactions</h3></li>
        </ul>
        <br />
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
            {records.length > 0 ? (
              records.map((record, index) => <Record key={index} record={record} />)
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
        <button>
          <Link to="/Money" style={{ textDecoration: 'none', color: 'inherit' }}>Go Back</Link>
        </button>
      </div>
    </div>
  );
}
