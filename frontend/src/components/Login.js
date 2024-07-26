import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";


export default function Create(){
    const [form, setForm] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()

    function updateForm(jsonObject){
        return setForm((prevJsonObject) => {
            return { ...prevJsonObject, ...jsonObject};
        })
    }

    async function onSubmit(e){
        e.preventDefault()
        
        const Person = {...form};
        const response = await fetch("http://localhost:5000/record/validAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(Person),
            credentials: 'include'
        })
        .catch(error => {
            window.alert(error);
            return;
        });
        const data = await response.json();

        console.log("HERE:" + data.message);

        if(!response.ok){ //If the user entered a invalid information, the validAccount route will responsed with error
            window.alert("enter valid username and password")
        }
        
      if(response.ok){ //if the user entered correct information
        navigate("/AccountSummary"); // navigate to the records page upon successful login
       } setForm({ email:"", password:""});

    }


    return (
        <div>
            <p>Sign In</p>
            <form onSubmit={onSubmit}>
                <div>
                    <label>email: </label>
                    <input type="text"
                    id="email"
                    value={form.email}
                    onChange={(e) => updateForm({email: e.target.value })}/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="text"
                    id="password"
                    value={form.password}
                    onChange={(e) => updateForm({password: e.target.value })}/>
                </div>
                <br />
                <div>
                    <input type="submit" value="Login in"/>
                </div>
            </form>
            <h3>Or register a Account</h3>
            <div>
            <p><Link to={"/Register"}>Create Account</Link></p>

            </div>
        </div>
    );
}