import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function LoginPage(){

    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    useEffect(() => {
        setEmail("");
        setPassword("");
    }, []);

    function onLogin(e){
        e.preventDefault()
        let errorDisp = document.getElementById("error-disp")
        errorDisp.innerText = ""

        if(email && password){
            fetch("http://localhost:5016/api/users/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401 || response.status === 400) {
                        return Promise.reject("Invalid credentials");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
                
            })
            .then(data => {
                sessionStorage.setItem('userId', data)
                window.location.href = "/home"
            })
            .catch(error => {
                console.error("Błąd:", error)
                errorDisp.innerText = "Błędny adres email lub hasło"
            })
        }else{
            errorDisp.innerText = "Wszystkie pola są wymagane."
        }
    }

    return(
        <div id="login-page">
            <h1>Logowanie</h1>
            <form action="">
                <input onChange={(e) => setEmail(e.target.value)} type="Email" placeholder="Email" value={email}/>
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Hasło" value={password}/>
                <button onClick={(e) => onLogin(e)}>Zaloguj się</button>
            </form>
            <p id="error-disp"></p>
            <Link to="/register">Nie masz konta? Przejdź do rejestracji.</Link>
        </div>
    )
}