import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function AddEditGoal(){

    let [title, setTitle] = useState('')
    let [description, setDescription] = useState('')
    let [priority, setPriotity] = useState('')
    let [deadline, setDeadline] = useState('')
    let [startTime, setStartTime] = useState('')
    let [goal, setGoal] = useState({})
    let navigate = useNavigate()

    useEffect(() => {
        getGoal()
    }, [])

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
                setTitle(json.title)
                setDescription(json.description)
                setDeadline(json.deadline)
                setStartTime(json.startTime)
                setPriotity(json.priority)
            })
            .catch(error => {
                console.log(error)
                setGoal([])
            })
        }        
    }
    
    function addGoal(){
        let errorDisp = document.getElementById('error-disp')
        let now = new Date()
        now.setSeconds(0,0)
        if(title && description && deadline && priority && startTime){
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

            fetch("http://localhost:5016/api/goals/add", {
                method: "POST",
                body: JSON.stringify({
                    userId: sessionStorage.getItem('userId'),
                    title: title,
                    description: description,
                    startTime: startTime,
                    deadline: deadline,
                    priority: priority
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
            })
            .then(response => {
                if (!response.ok) {                    
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                navigate('/home')
            })
            .catch(error => {
                console.error("Błąd:", error)
                errorDisp.innerText = "Cel o takiej nazwie już istnieje"
            })
              
        }else{
            errorDisp.innerText = "Uzupełnij wszystkie dane."
        }
    }

    function editGoal(){
        let errorDisp = document.getElementById('error-disp')
        let now = new Date()
        now.setSeconds(0,0)
        if(title && description && deadline && priority && startTime){

            let start = new Date(startTime)
            let end = new Date(deadline)

            if(start > end){
                errorDisp.innerText = "Data początku nie może być późniejsza od daty końca"
                return
            }

            fetch(`http://localhost:5016/api/goals/update/${goal.id}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title: title,
                    description: description,
                    startTime: startTime,
                    deadline: deadline,
                    priority: priority
                }),
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

    function back(){
        if(sessionStorage.getItem('mode') == 'add'){
            navigate('/home')
        }else{
            navigate('/goal-details')
        }
    }

    return(
        <>
            <NavBar/>
            <div className="main">
                <h2>
                    {sessionStorage.getItem('mode') == 'add' ? "Dodaj cel" : "Edytuj cel"}
                </h2>

                <form style={{alignItems: 'flex-start'}}>
                    {sessionStorage.getItem('mode') == 'add' ? 
                        <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Nazwa celu"/> :
                        <input onChange={(e) => setTitle(e.target.value)} type="text" value={title}/>
                    }
                    {sessionStorage.getItem('mode') == 'add' ? 
                        <input onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Opis"/> :
                        <input onChange={(e) => setDescription(e.target.value)} type="text" value={description}/>
                    }
                    <div className="btns">
                        {sessionStorage.getItem('mode') == 'add' ? 
                            <select onChange={(e) => setPriotity(e.target.value)}>
                                <option value="" disabled selected>Priorytet</option>
                                <option value="Low">Niski</option>
                                <option value="Med">Średni</option>
                                <option value="High">Wysoki</option>
                            </select> :
                            <select value={priority} onChange={(e) => setPriotity(e.target.value)}>
                                <option value="" disabled selected>Priorytet</option>
                                <option value="Low">Niski</option>
                                <option value="Med">Średni</option>
                                <option value="High">Wysoki</option>
                            </select>                    
                        }
                        <div className="date-input-container">
                            <label htmlFor="start-time">Początek:</label>
                            {sessionStorage.getItem('mode') == 'add' ? 
                                <input id="start-time" onChange={(e) => setStartTime(e.target.value)} type="datetime-local"/> :
                                <input id="start-time" onChange={(e) => setStartTime(e.target.value)} type="datetime-local" value={startTime}/>
                            } 
                        </div>
                        <div className="date-input-container">
                            <label htmlFor="deadline">Koniec:</label>
                            {sessionStorage.getItem('mode') == 'add' ? 
                                <input id="deadline" onChange={(e) => setDeadline(e.target.value)} type="datetime-local"/> :
                                <input id="deadline" onChange={(e) => setDeadline(e.target.value)} type="datetime-local" value={deadline}/>
                            } 
                        </div>
                    </div>
                </form>

                <p id="error-disp"></p>
                
                <div className="btns" style={{justifyContent: 'flex-start'}}>
                    {sessionStorage.getItem('mode') == 'add' ?
                        <button onClick={addGoal}>Zatwierdź</button> :
                        <button onClick={editGoal}>Zatwierdź</button>
                    }
                    <button onClick={back}>Wstecz</button>
                </div>
            </div>
        </>
    )
}