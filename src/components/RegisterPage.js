import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage(){

    let [email, setEmail] = useState("")
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [repPassword, setRepPassword] = useState("")

    function onRegister(e) {
        e.preventDefault();
        let errorDisp = document.getElementById('error-disp');
        errorDisp.innerText = "";
    
        if (email && username && password && repPassword) {
            if (username.length < 5) {
                errorDisp.innerText = "Nazwa użytkownika musi mieć co najmniej 5 znaków."
                return;
            }
            if (password !== repPassword) {
                errorDisp.innerText = "Hasła się różnią."
                return;
            }
    
            fetch("http://localhost:5016/api/users/register", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    username,
                    password
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 409) {
                        errorDisp.innerText = "Użytkownik o takim adresie email już istnieje."
                        return
                    }
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                window.location.href = "/"
            })
            .catch(error => {
                console.error("Błąd:", error)
                errorDisp.innerText = "Wprowadzono błędne dane."
            })
        } else {
            errorDisp.innerText = "Wszystkie pola są wymagane."
        }
    }
    
    

    return(
        <div id="register-page">
            <h1>Rejestracja</h1>
            <form>
                <input onChange={(e) => setEmail(e.target.value.trim())} type="Email" placeholder="Email"/>
                <input onChange={(e) => setUsername(e.target.value.trim())} type="text" minLength={5} placeholder="Nazwa użytkownika"/>
                <input onChange={(e) => setPassword(e.target.value.trim())} type="password" minLength={5} placeholder="Hasło"/>
                <input onChange={(e) => setRepPassword(e.target.value.trim())} type="password" minLength={5} placeholder="Powtóz hasło"/>
                <button onClick={(e) => onRegister(e)}>Zarejestruj się</button>
            </form>
            <p id="error-disp"></p>
            <Link to="/">Masz konto? Przejdź do logowania.</Link>
        </div>
    )
}