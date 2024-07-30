import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component to display a single record
const Record = (props) => (
  <tr>
    <td>{props.record.firstName}</td>
    <td>{props.record.lastName}</td>
    <td>{props.record.email}</td>
    <td>              <select>
                <option value="Admin">Admin</option>
                <option value="Customer">Customer</option>
                <option value="Employee">Employee</option>
              </select></td>
    <td><Link to={"/Money"}>Account Information</Link></td>
  </tr>
);

export default function Records() {
  
  const [record, setRecord] = useState(null);

  useEffect(() => {
    async function getRecord() {
      const response = await fetch(`http://localhost:5000/record/getUserBySession`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const fetchedRecord = await response.json();
      setRecord(fetchedRecord);
    }

    getRecord();
  }, []);
//This is why I am NOT going into the UX field, it works, but more i expermited with it the worst it got
  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h3 className="pl-3">Admin Details</h3></li>
          <li><h3><Link to="/Logout">Logout</Link></h3></li>
        </ul>
        <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>first Name</th>
              <th>Roles</th>
              <th>Change Role</th>
              <th>Checking/Savings</th>
            </tr>
          </thead>
          <tbody>
            {record ? <Record record={record}  /> : (
              <tr>
                <td colSpan="5" className="text-center">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
