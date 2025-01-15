import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddEditTask(){

    let [title, setTitle] = useState('')
    let [description, setDescription] = useState('')
    let [startTime, setStartTime] = useState('')
    let [deadline, setDeadline] = useState('')
    let [task, setTask] = useState({})
    let [goal, setGoal] = useState({})
    let navigate = useNavigate()

    useEffect(() => {
        getTask()
    }, [])

    useEffect(() => {
        getGoal()
    }, [task])

    function getTask(){
        let taskId = sessionStorage.getItem('taskId')
        if(taskId){
            fetch(`http://localhost:5016/api/tasks/${taskId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setTask(json)
                setTitle(json.title)
                setDescription(json.description)
                setStartTime(json.startTime)
                setDeadline(json.deadline)
            })
            .catch(error => {
                console.log(error)
                setTask({})
            })
        }        
    }

    function getGoal(){
        let goalId = sessionStorage.getItem('goalId')
        if(goalId){
            fetch(`http://localhost:5016/api/goals/${goalId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setGoal(json)
                console.log(json)
            })
            .catch(error => {
                console.log(error)
                setGoal({})
            })
        }        
    }
    
    function addTask(){
        let errorDisp = document.getElementById('error-disp')
        let now = new Date()
        now.setSeconds(0,0)
        if(title && description && deadline && startTime){
            let start = new Date(startTime)
            let end = new Date(deadline)

            if(start < now){
                errorDisp.innerText = "Data i godzina początku musi być conajmniej równa obecnej"
                return
            }

            if(end < now){
                errorDisp.innerText = "Data i godzina końca musi być conajmniej równa obecnej"
                return
            }

            if(start > end){
                errorDisp.innerText = "Data początku nie może być późniejsza od daty końca"
                return
            }

            fetch("http://localhost:5016/api/tasks/add", {
                method: "POST",
                body: JSON.stringify({
                    goalId: sessionStorage.getItem('goalId'),
                    title: title,
                    description: description,
                    startTime: startTime,
                    deadline: deadline
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then(response => {
                if (!response.ok) {                    
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                navigate('/goal-details')
            })
            .catch(error => {
                console.error("Błąd:", error)
            }) 
          
        }else{
            errorDisp.innerText = "Uzupełnij wszystkie dane."
        }
    }

    function editTask(){
        let errorDisp = document.getElementById('error-disp')
        let now = new Date()
        now.setSeconds(0,0)
        if(title && description && deadline && startTime){
            let start = new Date(startTime)
            let end = new Date(deadline)

            if(start > end){
                errorDisp.innerText = "Data początku nie może być późniejsza od daty końca"
                return
            }

            fetch(`http://localhost:5016/api/tasks/update/${task.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title: title,
                    description: description,
                    startTime: startTime,
                    deadline: deadline
                }),
            })
            .then(response => {
                if (!response.ok) {                    
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                navigate('/task-details')
            })
            .catch(error => {
                errorDisp.innerText = "Zadanie o takiej nazwie już istnieje"
                console.error("Błąd:", error)    
            }) 
          
        }else{
            errorDisp.innerText = "Uzupełnij wszystkie dane."
        }
    }

    function back(){
        if(sessionStorage.getItem('mode') == 'add'){
            navigate('/goal-details')
        }else{
            navigate('/task-details')
        }
    }

    return(
        <>
            <NavBar/>
            <div className="main">
                <h2>
                    {sessionStorage.getItem('mode') == 'add' ? "Dodaj zadanie" : "Edytuj zadanie"}
                </h2>

                <form style={{alignItems: 'flex-start'}}>
                    {sessionStorage.getItem('mode') == 'add' ? 
                        <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Nazwa zadania"/> :
                        <input onChange={(e) => setTitle(e.target.value)} type="text" value={title}/>
                    }
                    {sessionStorage.getItem('mode') == 'add' ? 
                        <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Opis"/> :
                        <input onChange={(e) => setDescription(e.target.value)} type="text" value={description}/>
                    
                    }
                    <div className="btns">
                        <div className="date-input-container">
                            <label htmlFor="start-time">Początek:</label>
                            {sessionStorage.getItem('mode') == 'add' ? 
                                <input min={goal.startTime} max={goal.deadline} id="start-time" onChange={(e) => setStartTime(e.target.value)} type="datetime-local"/> :
                                <input min={goal.startTime} max={goal.deadline} id="start-time" onChange={(e) => setStartTime(e.target.value)} type="datetime-local" value={startTime}/>
                            }                    
                        </div>
                        <div className="date-input-container">
                            <label htmlFor="deadline">Koniec:</label>
                            {sessionStorage.getItem('mode') == 'add' ? 
                                <input min={goal.startTime} max={goal.deadline} id="deadline" onChange={(e) => setDeadline(e.target.value)} type="datetime-local"/> :
                                <input min={goal.startTime} max={goal.deadline} id="deadline" onChange={(e) => setDeadline(e.target.value)} type="datetime-local" value={deadline}/>
                            }                    
                        </div>
                    </div>
                </form>
                            
                <p id="error-disp"></p>                            

                <div className="btns" style={{justifyContent: 'flex-start'}}>
                    {sessionStorage.getItem('mode') == 'add' ?
                        <button onClick={addTask}>Zatwierdź</button> :
                        <button onClick={editTask}>Zatwierdź</button>
                    }
                    <button onClick={back}>Wstecz</button>
                </div>
            </div>
        </>
    )
}