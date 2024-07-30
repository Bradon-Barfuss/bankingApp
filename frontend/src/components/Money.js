import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function AccountManagement() {
    const [account, setAccount] = useState({ savings: 0, checking: 0 });
    const [amount, setAmount] = useState("");

    const [accountType, setAccountType] = useState("savings");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAccount() {
            const response = await fetch("http://localhost:5000/record/getUserBySession", { //had to get the current user using the session by getting the email
                credentials: 'include'
            });

            const account = await response.json();
            setAccount(account);
        }

        fetchAccount();
    }, []);

    const Deposit = async () => {
        if (accountType === "savings") {

            const response = await fetch(`http://localhost:5000/updateSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            }
        }
        if (accountType === "checking") {

            const response = await fetch(`http://localhost:5000/updateChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            }

        };
    }

    const Withdraw = async () => {
        if (accountType === "savings") {

            const response = await fetch(`http://localhost:5000/withdrawSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            } else{
                window.alert("Can't go below 0")
            }
        }
        if (accountType === "checking") {

            const response = await fetch(`http://localhost:5000/withdrawChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: amount }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            } else{
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }

        };
    };

    return (
        <div class="mx-5">
            <div class="text-start border-bottom">
                <h3 class="mt-4">Account Management</h3>
            </div>
            <div class="mt-3">
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th>Savings: </th>
                            <td>{account.savings}</td>
                        </tr>
                        <tr>
                            <th>Checking: </th>
                            <td>{account.checking}</td>
                        </tr>
                        <tr>
                            <th>Investing: </th>
                            <td>{account.inesting}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between my-4">
                    <label class="col">
                        Account:
                        <select class="mx-2" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                            <option value="savings">Savings</option>
                            <option value="checking">Checking</option>
                            <option value="checking">Investing</option>
                        </select>
                    </label>
                    <label class="flex-direction-end">
                        Amount:
                        <input
                            class="mx-2"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                </div>
                <button onClick={Deposit}>Deposit</button>
                <button onClick={Withdraw}>Withdraw</button>
            </div>
        </div>
    );
}
