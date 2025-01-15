import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddEditNote(){

    let [content, setContent] = useState('')
    let [note, setNote] = useState({})
    let navigate = useNavigate()

    useEffect(() => {
        getNote()
    }, [])

    function getNote(){
        let noteId = sessionStorage.getItem('noteId')
        if(noteId){
            fetch(`http://localhost:5016/api/notes/${noteId}`)
            .then(response => {
                if(!response.ok){
                    throw new Error(response.statusText)
                }
                return response.json();
            })
            .then(json => {
                setNote(json)
                setContent(json.content)
            })
            .catch(error => {
                console.log(error)
                setNote([])
            })
        }        
    }
    
    function addNote(){
        if(content){
            fetch("http://localhost:5016/api/notes/add", {
                method: "POST",
                body: JSON.stringify({
                    taskId: sessionStorage.getItem('taskId'),
                    content: content
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then(response => {
                if (!response.ok) {                    
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                navigate('/task-details')
            })
            .catch(error => {
                console.error("Błąd:", error)
            })                    
        }
    }

    function editNote(){
        if(content){
            fetch(`http://localhost:5016/api/notes/update/${note.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    content: content
                }),
            })
            .then(response => {
                if (!response.ok) {                    
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                navigate('/task-details')
            })
            .catch(error => {
                console.error("Błąd:", error)
            })     
        }
    }

    function back(){
        navigate('/task-details')
    }

    return(
        <>
            <NavBar/>
            <div className="main">
                <h2>
                    {sessionStorage.getItem('mode') == 'add' ? "Dodaj notatkę" : "Edytuj notatkę"}
                </h2>
                {sessionStorage.getItem('mode') == 'add' ? 
                    <input onChange={(e) => setContent(e.target.value)} type="text" placeholder="Treść"/> :
                    <input onChange={(e) => setContent(e.target.value)} type="text" value={content}/>
                }
                
                <div className="btns" style={{justifyContent: 'flex-start'}}>
                    {sessionStorage.getItem('mode') == 'add' ?
                        <button onClick={addNote}>Zatwierdź</button> :
                        <button onClick={editNote}>Zatwierdź</button>
                    }
                    <button onClick={back}>Wstecz</button>
                </div>
            </div>
        </>
    )
}