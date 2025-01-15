import { useState, useEffect } from "react"
import NavBar from "./NavBar"
import GoalCard from "./GoalCard"

export default function AllGoalsPage(){

        let [userGoals, setUserGoals] = useState([])
        let [displayMode, setDisplayMobile] = useState('all')
    
        function getUserGoals(){
            let userId = sessionStorage.getItem('userId')
            fetch(`http://localhost:5016/api/goals/user/${userId}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .then(json => setUserGoals(json))
                .catch(error => {
                    console.log(error)
                    setUserGoals([])
                })
        }

        useEffect(() => {
            getUserGoals()
        }, [])

        useEffect(() => {
            indicateDisplayMode()
        }, [displayMode])

        let filteredGoals = userGoals.filter((goal) => {
            if (displayMode === "all") return true 
            if (displayMode === "uncompleted") return !goal.isCompleted && !goal.isOverdue 
            if (displayMode === "completed") return goal.isCompleted 
            if (displayMode === "overdue") return goal.isOverdue 
        })

        function indicateDisplayMode(){
            let modeIndicator = document.getElementById('mode-indicator')
            if (displayMode === "all") modeIndicator.innerText = "Wszystkie cele"
            if (displayMode === "uncompleted") modeIndicator.innerText = "Niewykonane cele"
            if (displayMode === "completed") modeIndicator.innerText = "Wykonane cele"
            if (displayMode === "overdue") modeIndicator.innerText = "Przeterminowane cele"
        }

    return(
        <>
            <NavBar/>
            <div className="main">
                <h2>Twoje cele</h2>
                <h3 id="mode-indicator"></h3>
                <div className="btns">
                    <button onClick={() => setDisplayMobile('all')}>Wszystkei cele</button>
                    <button onClick={() => setDisplayMobile('uncompleted')}>Niewykonane cele</button>
                    <button onClick={() => setDisplayMobile('completed')}>Wykonane cele</button>
                    <button onClick={() => setDisplayMobile('overdue')}>Przeterminowane cele</button>
                </div>
                {userGoals.length > 0 ?
                    <div className="goals-tasks-container">
                        {filteredGoals
                        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                        .map(g => (
                            <GoalCard key={g.id} data={g}></GoalCard>
                        ))}  
                    </div> : <h3>Brak celów, możesz je dodać.</h3>
                }
            </div>
        </>
    )
}