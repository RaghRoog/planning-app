import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import NoteCard from "./NoteCard";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";

export default function TaskDetails(){

    let [task, setTask] = useState({})
    let [notes, setNotes] = useState([])

    let navigate = useNavigate()

    useEffect(() => {
        getTask()
        getNotes()
    }, [])

    function getTask(){
        let taskId = sessionStorage.getItem('taskId')
        fetch(`http://localhost:5016/api/tasks/${taskId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => setTask(json))
            .catch(error => {
                console.log(error)
                setTask([])
            })
    }

    function getNotes(){
        let taskId = sessionStorage.getItem('taskId')
        fetch(`http://localhost:5016/api/notes/task/${taskId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => setNotes(json))
            .catch(error => {
                console.log(error)
                setNotes([])
            })
    }

    function onAddNote(){
        sessionStorage.setItem('taskId', task.id)
        sessionStorage.setItem('mode', 'add')
        window.location.href = '/add-edit-note'
    }

    function onEdit(){
        sessionStorage.setItem('taskId', task.id)
        sessionStorage.setItem('mode', 'edit')
        window.location.href = '/add-edit-task'
    }

    function deleteTask(){
        fetch(`http://localhost:5016/api/tasks/delete/${task.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {                    
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            navigate(sessionStorage.getItem('lastPath'))
        })
        .catch(error => {
            console.error("Błąd:", error)
        })
    }

    function changeIsCompleted(){
        let newIsCompleted = !task.isCompleted
        let now = new Date()
        now.setSeconds(0,0)
        let completionDate
        if(newIsCompleted){
            completionDate = now
        }else{
            completionDate = null
        }

        fetch(`http://localhost:5016/api/tasks/update/${task.id}`, {
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

    return(
        <>
            <NavBar/>
            <div id="task-details" className="main">
                <h2>Szczegóły zadania</h2>
                <h3>Nazwa zadania</h3>
                <p>{task.title}</p>
                <h3>Opis zadania</h3>
                <p>{task.description}</p>
                <h3>Początek</h3>
                <p>{task.startTime ? task.startTime.replace("T", " ") : task.startTime}</p>
                <h3>Koniec</h3>
                <p>{task.deadline ? task.deadline.replace("T", " ") : task.deadline}</p>
                <h3>Postęp</h3>
                {task.isCompleted ? <p>Wykonano</p> : <p>Nie wykonano</p>}
                {(task.isOverdue && !task.isCompleted) ? <p style={{color: 'red'}}>Przeterminowane</p> : null}


                <div className="btns">
                    {!task.isOverdue ? 
                        <>
                            <button onClick={changeIsCompleted}>
                                {task.isCompleted ? "Nie wykonano" : "Wykonano"}
                            </button>
                            {!task.isCompleted ? 
                                <>
                                    <button onClick={onEdit}>Edytuj</button>
                                    <button onClick={onAddNote}>Dodaj notatkę</button>
                                </> : null
                            }
                        </> : null
                    }

                    <button onClick={deleteTask}>Usuń</button>
                    <button onClick={() => navigate(sessionStorage.getItem('lastPath'))}>Wstecz</button>
                </div>

                {notes.length > 0 ? 
                    <>
                        <h2>Notatki</h2>
                        <Carousel containerId="tasks-notes" data={notes} Component={NoteCard}/>
                    </> : null
                } 
            </div>
        </>
    )
}