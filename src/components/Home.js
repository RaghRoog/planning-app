import NavBar from "./NavBar";
import TaskCard from "./TaskCard";
import GoalCard from "./GoalCard";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import Carousel from "./Carousel";
import MyCalendar from "./MyCalendar";

export default function Home(){

    let [userTasks, setUserTasks] = useState([])
    let [userGoals, setUserGoals] = useState([])

    let [filteredTasks, setFilteredTasks] = useState([])
    let [filteredGoals, setFilteredGoals] = useState([])

    let navigate = useNavigate()

    useEffect(() => {
        getUserTasks()
        getUserGoals()
    }, [])

    function getUserTasks(){
        let userId = sessionStorage.getItem('userId')
        fetch(`http://localhost:5016/api/tasks/user/${userId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setUserTasks(json)
                setFilteredTasks(json.filter(task => (task.isCompleted === false && task.isOverdue === false)))
            })
            .catch(error => {
                console.log(error)
                setUserTasks([])
            })
    }

    function getUserGoals(){
        let userId = sessionStorage.getItem('userId')
        fetch(`http://localhost:5016/api/goals/user/${userId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setUserGoals(json)
                setFilteredGoals(json.filter(goal => (goal.isCompleted === false && goal.isOverdue === false)))
            })
            .catch(error => {
                console.log(error)
                setUserGoals([])
            })
    }

    function onAddGoal(){
        sessionStorage.setItem('mode', 'add')
        navigate('/add-edit-goal')
    }

    return(
        <>
            <NavBar/>
            <div id="home" className="main">
                <div className="btns">
                    <button onClick={onAddGoal}>Dodaj Cel</button>
                    <button onClick={() => navigate('/all-goals')}>Wszystkie cele</button>
                    <button onClick={() => navigate('/all-tasks')}>Wszystkie zadania</button>
                    <button onClick={() => navigate('/statistics-page')}>Statystyki</button>
                    <button onClick={() => navigate('/notifications-page')}>Powiadomienia</button>
                </div>
                
                <h2>Najbliższe zadania</h2>
                {filteredTasks.length > 0 ? <Carousel containerId="tasks-carousel" data={filteredTasks} limit={8} Component={TaskCard}/> : 
                                        <h3>Brak najbliższych zadań, możesz je dodać.</h3>}

                <h2>Najbliższe cele</h2>
                {filteredGoals.length > 0 ? <Carousel containerId="goals-carousel" data={filteredGoals} limit={8} Component={GoalCard}/> : 
                                        <h3>Brak najbliższych celów, możesz je dodać.</h3>}

                <u><a href="/calendar-page" className="calendar-link">Kalendarz</a></u>
                <MyCalendar goals={userGoals} tasks={userTasks} size={"min(400px, 90vw)"}/>
            </div>
        </>
    )
}