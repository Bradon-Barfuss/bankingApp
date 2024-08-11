import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


export default function AccountManagement() {
    const {accountNumber} = useParams();
    

    const [account, setAccount] = useState({ savings: 0, checking: 0, investing: 0, email: "" });
    const [accountType, setAccountType] = useState("savings");
    const [amount, setAmount] = useState("");

    const [accountTypeSending, setAccountTypeSending] = useState("savings");
    const [accountTypeReciving, setAccountTypeReciving] = useState("checking");
    const [amountInteral, setAmountInteral] = useState("");



    const [accountNumberExternalSending, setAccountNumberExternalSending] = useState("savings");
    const [accountNumberExternalRecieving, setAccountNumberExternalRecieving] = useState("savings");
    const [accountTypeExternalSending, setAccountTypeExternalSending] = useState("savings");
    const [accountTypeExternalReciving, setAccountTypeExternalReciving] = useState("checking");
    const [amountExternal, setAmountExternal] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAccount() {
            const response = await fetch(`http://localhost:5000/users/getUserById/${accountNumber}`, { //had to get the current user using the session by getting the email
                credentials: 'include'
            });
            const account = await response.json();
            setAccount(account);
        }
        console.log(account)
        fetchAccount();
    }, []);

    const Deposit = async () => {
        console.log("ACCOUNT TYPE: ", accountType)
        console.log("AMOUNT: ", amount)
        console.log("Email: ", amount.email)

        if (accountType === "savings") {
            const response = await fetch(`http://localhost:5000/banking/increaseSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                const updatedSavings = parseFloat(account.savings) + parseFloat(amount);
                const updatedAccount = {
                    savings: updatedSavings,
                    checking: account.checking,
                    investing: account.investing,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            }
        }

        if (accountType === "checking") {
            const response = await fetch(`http://localhost:5000/banking/increaseChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amount) }),
            });

            if (response.ok) {
                const updatedChecking = parseFloat(account.checking) + parseFloat(amount);
                const updatedAccount = {
                    savings: account.savings,
                    checking: updatedChecking,
                    investing: account.investing,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            }
        };

        if (accountType === "investing") {
            const response = await fetch(`http://localhost:5000/banking/increaseInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amount) }),
            });
            if (response.ok) {
                const updatedInvesting = parseFloat(account.investing) + parseFloat(amount);
                const updatedAccount = {
                    savings: account.savings,
                    checking: account.checking,
                    investing: updatedInvesting,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            } 
        };
        await fetch(`http://localhost:5000/transaction/addTransaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ accountNumber: account.accountNumber, AccountType: accountType, AmountSent:  parseFloat(amount) }),
        });
    }


    const Withdraw = async () => {
        if (accountType === "savings") {
            const response = await fetch(`http://localhost:5000/banking/withdrawSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                const updatedSavings = parseFloat(account.savings) - parseFloat(amount);
                const updatedAccount = {
                    savings: updatedSavings,
                    checking: account.checking,
                    investing: account.investing,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            } else {
                window.alert("Can't go below 0")
            }
        }
        if (accountType === "checking") {
            const response = await fetch(`http://localhost:5000/banking/withdrawChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amount) }),
            });
            if (response.ok) {
                const updatedChecking = parseFloat(account.checking) - parseFloat(amount);
                const updatedAccount = {
                    savings: account.savings,
                    checking: updatedChecking,
                    investing: account.investing,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }
        };
        if (accountType === "investing") {
            const response = await fetch(`http://localhost:5000/banking/withdrawInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amount) }),
            });

            if (response.ok) {
                const updatedInvesting = parseFloat(account.investing) - parseFloat(amount);
                const updatedAccount = {
                    savings: account.savings,
                    checking: account.checking,
                    investing: updatedInvesting,
                    role: account.role,
                    email: account.email,
                    accountNumber: account.accountNumber
                };
                setAccount(updatedAccount);
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }
        };
        await fetch(`http://localhost:5000/transaction/addTransaction`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ accountNumber: account.accountNumber, AccountType: accountType, AmountSent:  parseFloat(amount) }),
        });
    };

    //================= TRANSFER INTERAL ====================

    const TransferInteral = async () => {
        let updatedSavingsInteral = account.savings
        let updatedCheckingInteral = account.checking
        let updatedInvestingInteral = account.investing

        if (accountTypeSending === "savings") {
            const response = await fetch(`http://localhost:5000/banking/withdrawSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amountInteral) }),
            });

            if (response.ok) {
                updatedSavingsInteral = parseFloat(account.savings) - parseFloat(amountInteral);
                console.log("\n\nAfter decreasing savings account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }
        else if (accountTypeSending === "checking") {
            const response = await fetch(`http://localhost:5000/banking/withdrawChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amountInteral) }),
            });
            if (response.ok) {
                updatedCheckingInteral = parseFloat(account.checking) - parseFloat(amountInteral);
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }
        }
        else if (accountTypeSending === "investing") {
            const response = await fetch(`http://localhost:5000/banking/withdrawInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amountInteral) }),
            });

            if (response.ok) {
                updatedInvestingInteral = parseFloat(account.investing) - parseFloat(amountInteral);
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }
        };

        //internal deposit 
        if (accountTypeReciving === "savings") {
            const response = await fetch(`http://localhost:5000/banking/increaseSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amountInteral) }),
            });

            if (response.ok) {
                updatedSavingsInteral = parseFloat(account.savings) + parseFloat(amountInteral);
            }
        }

        else if (accountTypeReciving === "checking") {
            const response = await fetch(`http://localhost:5000/banking/increaseChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amountInteral) }),
            });

            if (response.ok) {
                updatedCheckingInteral = parseFloat(account.checking) + parseFloat(amountInteral);
            }
        }

        else if (accountTypeReciving === "investing") {
            const response = await fetch(`http://localhost:5000/banking/increaseInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amountInteral) }),
            });
            if (response.ok) {
                updatedInvestingInteral = parseFloat(account.investing) + parseFloat(amountInteral);
            }
        };
        await fetch(`http://localhost:5000/transaction/addTransactionInternal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ accountNumber: account.accountNumber, SendingAccount: accountTypeSending, RecievingAccount: accountTypeReciving,  AmountSent: parseFloat(amountInteral) }),
        });

        const updatedAccount = {
            savings: updatedSavingsInteral,
            checking: updatedCheckingInteral,
            investing: updatedInvestingInteral,
            role: account.role,
            email: account.email,
            accountNumber: account.accountNumber
        };

        setAccount(updatedAccount)
    };


            console.log('Account Number Sending: ', accountNumberExternalSending, "\nAccount Type Sending: ", accountTypeExternalSending, 
                "\n Account Number Reciving: ", accountNumberExternalRecieving, "\nAccount Type Reciving: ", amountExternal)

    //================= TRANSFER EXTERNAL ====================

    const TransferExternal = async () => {
        let updatedSavingsExternal = account.savings
        let updatedCheckingExternal = account.checking
        let updatedInvestingExternal = account.investing

        if (accountTypeExternalSending === "savings") {
            const response = await fetch(`http://localhost:5000/banking/decreaseSavingsExternal/${accountNumberExternalSending}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                updatedSavingsExternal = parseFloat(account.savings) - parseFloat(amountExternal);
                console.log("\n\nAfter decreasing savings account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }

        if (accountTypeExternalSending === "checking") {
            const response = await fetch(`http://localhost:5000/banking/decreaseCheckingExternal/${accountNumberExternalSending}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                updatedCheckingExternal = parseFloat(account.checking) - parseFloat(amountExternal);
                console.log("\n\nAfter decreasing checking account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }
        if (accountTypeExternalSending === "investing") {
            const response = await fetch(`http://localhost:5000/banking/decreaseInvestingExternal/${accountNumberExternalSending}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                updatedInvestingExternal = parseFloat(account.investing) - parseFloat(amountExternal);
                console.log("\n\nAfter decreasing investing account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }


        if (accountTypeExternalReciving === "savings") {
            const response = await fetch(`http://localhost:5000/banking/increaseSavingsExternal/${accountNumberExternalRecieving}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                console.log("\n\nAfter increase savings account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }
        if (accountTypeExternalReciving === "checking") {
            const response = await fetch(`http://localhost:5000/banking/increaseCheckingExternal/${accountNumberExternalRecieving}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                console.log("\n\nAfter increase checking account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }

        if (accountTypeExternalReciving === "investing") {
            const response = await fetch(`http://localhost:5000/banking/increaseInvestingExternal/${accountNumberExternalRecieving}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ investing: parseFloat(amountExternal) }),
            });

            if (response.ok) {
                console.log("\n\nAfter increase investing account: ", account)
            } else {
                window.alert("Can't go below 0")
            }
        }

        const results = await fetch(`http://localhost:5000/transaction/addTransactionExternal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ SendingAccountNumber: parseInt(accountNumberExternalSending), RecievingAccountNumber: parseInt(accountNumberExternalRecieving),
                SendingAccount: accountTypeExternalSending, RecievingAccount: accountTypeExternalReciving,   AmountSent: parseFloat(amountExternal) }),
        });


        const updatedAccount = {
            savings: updatedSavingsExternal,
            checking: updatedCheckingExternal,
            investing: updatedInvestingExternal,
            role: account.role,
            email: account.email,
            accountNumber: account.accountNumber
        };

        setAccount(updatedAccount)
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
                            <td>{account.investing}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between my-4">
                    <label class="col">
                        Account:
                        <select class="mx-2" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                            <option value="savings">Savings</option>
                            <option value="checking">Checking</option>
                            <option value="investing">Investing</option>
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
                <button><Link to={`/TransactionHistory/${account.accountNumber}`} style={{ textDecoration: 'none', color: 'inherit' }}>Transaction History</Link></button>
                <div>
                    <br />
                    <h2>Internal Transfer</h2>
                    <div className="d-flex justify-content-between my-0">
                        <label className="d-flex align-items-center">
                            From:
                            <select className="mx-2" value={accountTypeSending} onChange={(e) => setAccountTypeSending(e.target.value)}>
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investing">Investing</option>
                            </select>
                        </label>
                        <label className="d-flex align-items-center">
                            To:
                            <select className="mx-2" value={accountTypeReciving} onChange={(e) => setAccountTypeReciving(e.target.value)}>
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investing">Investing</option>
                            </select>
                        </label>
                        <label className="d-flex align-items-center">
                            Amount:
                            <input
                                className="mx-2"
                                type="number"
                                value={amountInteral}
                                onChange={(e) => setAmountInteral(e.target.value)}
                            />
                        </label>
                    </div>
                    <button onClick={TransferInteral}>Submit</button>
                </div>


                    <div>
                        <br />
                        <h2>External Transfer</h2>
                        <div className="d-flex justify-content-start my-0">
                            <label className="d-flex align-items-center me-3">
                                <label class="flex-direction-end">
                                    From:
                                    <input
                                        class="mx-2"
                                        type="number"
                                        value={accountNumberExternalSending}
                                        onChange={(e) => setAccountNumberExternalSending(e.target.value)}
                                    />
                                </label>
                                <label className="d-flex align-items-center">
                                    To:
                                    <input
                                        class="mx-2"
                                        type="number"
                                        value={accountNumberExternalRecieving}
                                        onChange={(e) => setAccountNumberExternalRecieving(e.target.value)}
                                    />
                                </label>
                            </label>

                        </div>

                        <div className="d-flex justify-content-between my-0">
                            <label className="d-flex align-items-center">
                                From:
                                <select className="mx-2" value={accountTypeExternalSending} onChange={(e) => setAccountTypeExternalSending(e.target.value)}>
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>
                                    <option value="investing">Investing</option>
                                </select>
                            </label>
                            <label className="d-flex align-items-center">
                                To:
                                <select className="mx-2" value={accountTypeExternalReciving} onChange={(e) => setAccountTypeExternalReciving(e.target.value)}>
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>
                                    <option value="investing">Investing</option>
                                </select>
                            </label>
                            <label className="d-flex align-items-center">
                                Amount:
                                <input
                                    className="mx-2"
                                    type="number"
                                    value={amountExternal}
                                    onChange={(e) => setAmountExternal(e.target.value)}
                                />
                            </label>
                        </div>
                        <button onClick={TransferExternal}>Submit</button>
                        <div className="d-flex align-items-center">
                            <br />
                            <h2>Create New Account: </h2>
                            <Link to={"/Register"} className="btn btn-primary btn-sm" style={{ marginLeft: '10px' }}>Create Account</Link>
                        </div>
                    </div>
                
            </div>

        </div>
    );
}

/* internal


                */

/*
EXTERNAL


                */