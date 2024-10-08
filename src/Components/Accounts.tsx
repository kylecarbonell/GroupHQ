import Bar from "./InnerComponents/Bar";
import "./Accounts.css"
import { useEffect, useRef, useState } from "react";
import React from "react";

import { useNavigate } from "react-router-dom";
import { call } from "../Data/GroupData";

function Accounts() {
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    const [create, setCreate] = useState(false)

    const navigate = useNavigate();

    /**
     * Resets the users local storage, simulating a "Logout" function
     */
    const logout = () => {
        console.log("CHANGED AND LOGGED")
        navigate("/")
        window.localStorage.setItem("Data", "")
    }

    /**
     * Creates and adds a new user to the database.
     * Submits a post request to the backend that will
     * add a new account to the "Users" collection
     * 
     * On a successful post request, the function will call the 
     * onSubmit() function to log the user in.
     */
    const submitCreate = async (e: any) => {
        if (email == "" || pw == "" || first == "" || last == "") {
            alert("Please fill in all boxes")
            return
        }

        e.preventDefault()

        const doc = { email: email, pw: pw, first: first, last: last }

        console.log(doc)

        const result = await fetch(`${call}/createAccount`, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: doc })
        }).then((res) => {
            const temp = res.status



            if (res.status == 200) {
                alert("Account Created")
                onSubmit(e)
                setFirst("")
                setLast("")
                setEmail("")
                setPw("")

                setCreate(false)
            } else {
                alert("Email is already taken")
            }

        })
    }

    /**
     * Creates a get request to the backend to find 
     * a user in the "User" collection. The backend will 
     * perform a check to ensure the passwords match.
     * 
     * On a successful request, the function will set the Data
     * in the localStorage to simulate a log in
     */
    const onSubmit = async (e: any) => {
        if (email == "" || pw == "") {
            alert("Invalid login information")
            return
        }

        e.preventDefault()

        const data = { email: email, pw: pw }
        const result = await fetch(`${call}/getAccount?data=${JSON.stringify(data)}`).then(async (res) => {
            console.log("HERE")
            console.log(res.status)

            if (res.status == 200) {
                const json = await res.json()
                window.localStorage.setItem("Data", JSON.stringify(json))
                setEmail("")
                setPw("")

                navigate("/groups", {})
            } else if (res.status == 201) {
                alert("Incorrect password")
            } else {
                alert("Email does not exist")
            }
        });

    }

    return (
        <>
            <div className="Accounts-Page-Container">
                <Bar></Bar>
                <div className="Accounts-Login-Container">
                    {
                        window.localStorage.getItem("Data") != "" ?
                            <form className="Accounts-Login" onSubmit={(e) => {
                                e.preventDefault()
                            }}>
                                <h1>Logout?</h1>
                                <button onClick={() => {
                                    console.log("HI")
                                    logout()
                                }} style={{ marginBottom: "1%" }}>Confirm</button>
                            </form>
                            :
                            create == false ?
                                <form className="Accounts-Login">
                                    <h1 style={{ color: "var(--blue)" }}>Login</h1>

                                    <label className="Accounts-Login-Input">
                                        Email
                                        <input onChange={(e) => {
                                            setEmail(e.target.value)
                                        }} value={email}></input>
                                    </label>
                                    <label className="Accounts-Login-Input">
                                        Password
                                        <input onChange={(e) => {
                                            setPw(e.target.value)
                                        }} value={pw} type="Password"></input>
                                    </label>



                                    <button onClick={(e) => onSubmit(e)} style={{ marginBottom: "1%" }}>Login</button>
                                    <button style={{ backgroundColor: "var(--yellow)", border: "none", outline: "none" }} onClick={() => {
                                        setCreate(true)

                                    }}>Create Account</button>
                                </form>

                                :

                                <form className="Accounts-Login">
                                    <h1 style={{ color: "var(--blue)" }}>Create Account</h1>
                                    <label className="Accounts-Login-Input">
                                        First Name
                                        <input onChange={(e) => {
                                            setFirst(e.target.value)
                                        }} value={first}></input>
                                    </label>
                                    <label className="Accounts-Login-Input">
                                        Last Name
                                        <input onChange={(e) => {
                                            setLast(e.target.value)
                                        }} value={last}></input>
                                    </label>
                                    <label className="Accounts-Login-Input">
                                        Email
                                        <input onChange={(e) => {
                                            setEmail(e.target.value)
                                        }} value={email}></input>
                                    </label>
                                    <label className="Accounts-Login-Input">
                                        Password
                                        <input onChange={(e) => {
                                            setPw(e.target.value)
                                        }} value={pw} type="password"></input>
                                    </label>



                                    <button onClick={(e) => submitCreate(e)} style={{ marginBottom: "1%" }}>Create</button>
                                </form>
                    }

                </div>

            </div >

        </>
    )
}

export default Accounts;
