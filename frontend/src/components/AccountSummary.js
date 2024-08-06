import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component to display a single record
const Record = ({ record, onRoleChange }) => {

  const [role, setRole] = useState(record.role);

  const handleRoleChange = async (event) => {
    const newRole = event.target.value;
    setRole(newRole);
    onRoleChange(record.email, newRole);

    try {
      const response = await fetch(`http://localhost:5000/users/updateRole/${record.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <tr>
      <td>{record.accountNumber}</td>
      <td>{record.firstName}</td>
      <td>{record.lastName}</td>
      <td>{record.email}</td>
      <td>
        <select value={role} onChange={handleRoleChange}>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
          <option value="Employee">Employee</option>
        </select>
      </td>
      <td><Link to={"/Money"}>Account Information</Link></td>
    </tr>
  );
};


export default function Records() {
  const [records, setRecords] = useState([]);
  
  useEffect(() => {
    async function getRecord() {
      const response = await fetch(`http://localhost:5000/users/listAllUsers`, { //change to route to get all users
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

    getRecord();
  }, []);

  //https://stackoverflow.com/questions/37435334/correct-way-to-push-into-state-array
  const handleRoleChange = (email, newRole) => {
    setRecords(prevRecords =>
      prevRecords.map(record =>
        record.email === email ? { ...record, role: newRole } : record
      )
    );
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h3 className="pl-3">Admin Details</h3></li>
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
            {records ? (records.map(record => (
              <Record key={record._id} record={record} onRoleChange={handleRoleChange} />
            ))) : (
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
