import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Component to display a single record
const Record = (props) => (
  <tr>
    <td>{props.record.firstName}</td>
    <td>{props.record.lastName}</td>
    <td>{props.record.email}</td>
    <td>{props.record.phoneNumber}</td>
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
    <div style={{ fontSize: 18, backgroundColor: "lightgray" }}> 
      <div>
        <ul style={{ "list-style-type": "none",   overflow: "hidden"}}>
          <li><h3 style={{   float: "left", paddingLeft: 20 }}>Account Details</h3></li>
          <li><h3><Link  style={{ float: "left" }} to={"/Logout"}>Logout</Link></h3></li>
        </ul>

      </div>
<br></br>
      <table style={{}}>
        <thead>
          <tr >
            <th style={{ padding: 20 }}>First Name</th>
            <th style={{ padding: 20 }}>Last Name</th>
            <th style={{ padding: 20 }}> Email</th>
            <th style={{ padding: 20 }}>Phone Number</th>
            <th style={{ padding: 20 }}>Checking/Savings</th>

          </tr>
        </thead>
        <tbody>
          <Record style={{ padding: 20 }} record={record || { firstname: "", lastname: "", email: "", phoneNumber: "" }} />
        </tbody>
      </table>

    </div>
  );
}
