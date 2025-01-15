import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import MyCalendar from "./MyCalendar";

export default function CalendarPage(){

    let [goals, setGoals] = useState([])
    let [tasks, setTasks] = useState([])

    useEffect(() => {
            getTasks()
            getGoals()
        }, [])
    
        function getTasks(){
            let userId = sessionStorage.getItem('userId')
            fetch(`http://localhost:5016/api/tasks/user/${userId}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .then(json => setTasks(json))
                .catch(error => {
                    console.log(error)
                    setTasks([])
                })
        }
    
        function getGoals(){
            let userId = sessionStorage.getItem('userId')
            fetch(`http://localhost:5016/api/goals/user/${userId}`)
                .then(response => {
                    if(!response.ok){
                        throw new Error(response.statusText)
                    }
                    return response.json();
                })
                .then(json => setGoals(json))
                .catch(error => {
                    console.log(error)
                    setGoals([])
                })
        }

    return(
        <>
            <NavBar/>
            <div className="main">
                <h2>Kalendarz</h2>
                <p style={{color: 'blue'}}>Cel</p>
                <p style={{color: 'green'}}>Zadanie</p>
                <MyCalendar goals={goals} tasks={tasks} size={"90vw"}/>
            </div>
        </>
    )
}