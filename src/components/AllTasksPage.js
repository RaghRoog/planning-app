import { useState, useEffect } from "react"
import NavBar from "./NavBar"
import TaskCard from "./TaskCard"

export default function AllTasksPage(){

        let [userTasks, setUserTasks] = useState([])
        let [displayMode, setDisplayMobile] = useState('all')
    
        function getUserTasks(){
            let userId = sessionStorage.getItem('userId')
            fetch(`http://localhost:5016/api/tasks/user/${userId}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .then(json => setUserTasks(json))
                .catch(error => {
                    console.log(error)
                    setUserTasks([])
                })
        }

        useEffect(() => {
            getUserTasks()
        }, [])

        useEffect(() => {
            indicateDisplayMode()
        }, [displayMode])

        let filteredTasks = userTasks.filter((task) => {
            if (displayMode === "all") return true 
            if (displayMode === "uncompleted") return !task.isCompleted && !task.isOverdue 
            if (displayMode === "completed") return task.isCompleted
            if (displayMode === "overdue") return task.isOverdue
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
                <h2>Twoje zadania</h2>
                <h3 id="mode-indicator"></h3>
                <div className="btns">
                    <button onClick={() => setDisplayMobile('all')}>Wszystkei zadania</button>
                    <button onClick={() => setDisplayMobile('uncompleted')}>Niewykonane zadania</button>
                    <button onClick={() => setDisplayMobile('completed')}>Wykonane zadania</button>
                    <button onClick={() => setDisplayMobile('overdue')}>Przeterminowane zadania</button>
                </div>
                {userTasks.length > 0 ?
                    <div className="goals-tasks-container">
                        {filteredTasks
                        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                        .map(t => (
                            <TaskCard key={t.id} data={t}></TaskCard>
                        ))}  
                    </div> : <h3>Brak zadań, możesz je dodać.</h3>
                }
            </div>
        </>
    )
}