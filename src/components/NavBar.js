import { useState } from "react";

export default function NavBar() {

    let [displayMobile, setDisplayMobile] = useState(false)

    function displayMobileNav(){
        let navItems = document.getElementById('nav-items')
        if(displayMobile === false){
            navItems.style.display = 'flex'    
            navItems.style.flexDirection = 'column'
        }else{
            navItems.style.display = 'none'
        }
        setDisplayMobile(!displayMobile)
    }
    
    function logOut(){
        sessionStorage.setItem('userId', "")
        sessionStorage.setItem('taskId', "")
        sessionStorage.setItem('goalId', "")
        window.location.href = "/"
    }

    return (
        <div id="nav-bar">
            <div id="nav-items">
                <button onClick={() => window.location.href = "/home"} id="home-btn" className="nav-btn">Strona główna</button>
                <button onClick={logOut} className="nav-btn">Wyloguj się</button>
            </div>
            <div onClick={displayMobileNav} id="menu-icon">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
