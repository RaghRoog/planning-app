import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Carousel from "./Carousel";
import TaskCard from "./TaskCard";
import { useNavigate } from "react-router-dom";

export default function GoalDetails(){

    let [goal, setGoal] = useState({})
    let [goalTasks, setGoalTasks] = useState([])
    let [priority, setPriotity] = useState('')
    let [progress, setProgress] = useState(0)
    let [isCompleted, setIsCompleted] = useState(false)

    let navigate = useNavigate()

    useEffect(() => {
        getGoal()
        getGoalTasks()
    }, [])

    useEffect(() => {
        setProgress(calcProgres())
    }, [goalTasks])

    useEffect(() => {
        let newIsCompleted = progress === 100;
        let now = new Date()
        now.setSeconds(0,0)
        let completionDate
        if(newIsCompleted){
            completionDate = now
        }else{
            completionDate = null
        }
        if (goal && goal.id && progress !== goal.progress) {
            fetch(`http://localhost:5016/api/goals/update/${goal.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    progress: progress,
                    isCompleted: newIsCompleted,
                    completionDate: completionDate 
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                location.reload()
            })
            .catch(error => {
                console.error("Błąd:", error)
            })
        }
    }, [progress, goal])

    function getGoal(){
        let goalId = sessionStorage.getItem('goalId')
        fetch(`http://localhost:5016/api/goals/${goalId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setGoal(json)
                setProgress(json.progress)
                setIsCompleted(json.isCompleted)
                if(json.priority === 'High') setPriotity("Wysoki")
                if(json.priority === 'Med') setPriotity("Średni")
                if(json.priority === 'Low') setPriotity("Niski")
            })
            .catch(error => {
                console.log(error)
                setGoal([])
            })
    }

    function  getGoalTasks(){
        let goalId = sessionStorage.getItem('goalId')
        fetch(`http://localhost:5016/api/tasks/goal/${goalId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => setGoalTasks(json))
            .catch(error => {
                console.log(error)
                setGoalTasks([])
            })
    }

    function deleteGoal(){
        fetch(`http://localhost:5016/api/goals/delete/${goal.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {                    
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            navigate('/home')
        })
        .catch(error => {
            console.error("Błąd:", error)
        })
    }

    function changeIsCompleted(){
        let newIsCompleted = !goal.isCompleted
        let now = new Date()
        now.setSeconds(0,0)
        let completionDate
        if(newIsCompleted){
            completionDate = now
        }else{
            completionDate = null
        }
        fetch(`http://localhost:5016/api/goals/update/${goal.id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                isCompleted: newIsCompleted,
                completionDate: completionDate
            }),
        })
        .then(response => {
            if (!response.ok) {                    
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            location.reload()
        })
        .catch(error => {
            console.error("Błąd:", error)
        })
    }

    function onAddTask(){
        sessionStorage.setItem('goalId', goal.id)
        sessionStorage.setItem('mode', 'add')
        window.location.href = '/add-edit-task'
    }

    function onEdit(){
        sessionStorage.setItem('goalId', goal.id)
        sessionStorage.setItem('mode', 'edit')
        window.location.href = '/add-edit-goal'
    }

    function calcProgres(){
        let allTasksLength = goalTasks.length
        let completedTasksLength = goalTasks.filter(t => t.isCompleted === true).length

        let progress = allTasksLength > 0 ? (completedTasksLength/allTasksLength) * 100 : 0
        return Math.round(progress)
    }

    return(
        <>
        <NavBar/>
            <div id="goal-details" className="main">
                <h2>Szczegóły celu</h2>
                <h3>Nazwa celu</h3>
                <p>{goal.title}</p>
                <h3>Opis</h3>
                <p style={{maxWidth: "300px"}}>{goal.description}</p>
                <h3>Priorytet</h3>
                <p>{priority}</p>
                <h3>Początek</h3>
                <p>{goal.startTime ? goal.startTime.replace("T", " ") : goal.startTime}</p>
                <h3>Koniec</h3>
                <p>{goal.deadline ? goal.deadline.replace("T", " ") : goal.deadline}</p>

                {goalTasks.length < 1 ? 
                    (goal.isCompleted ? 
                    <><h3>Postęp</h3><p color="green">Wykonano</p></> : 
                    <><h3>Postęp</h3><p>Nie wykonano</p></>) : 
                    <><h3>Postęp</h3><p>{goal.progress}%</p></>
                } 
                
                {(goal.isOverdue && !goal.isCompleted) ? <p style={{color: 'red'}}>Przeterminowane</p> : null}

                <div className="btns">
                    {(!goal.isOverdue) ?
                        <>
                        {goalTasks.length < 1 ? 
                            (goal.isCompleted ? 
                            <button onClick={changeIsCompleted}>Nie wykonano</button> : 
                            <button onClick={changeIsCompleted}>Wykonano</button>) : 
                            null
                        }
                        {!goal.isCompleted ?
                            <>
                                <button onClick={onEdit}>Edytuj</button>
                                <button onClick={onAddTask}>Dodaj zadanie</button>
                            </> : null
                        }
                        </> : null
                    }
                    
                    <button onClick={deleteGoal}>Usuń</button>
                    <button onClick={() => navigate('/all-goals')}>Wszystkie cele</button>
                </div>
                {goalTasks.length > 0 ? 
                    <>
                        <h2>Zadania w celu</h2>
                        <Carousel containerId="goal-tasks" data={goalTasks} Component={TaskCard}/>
                    </> : null
                }                
            </div>
        </>
    )
}