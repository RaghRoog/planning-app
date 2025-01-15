import { useEffect, useState } from "react"

export default function GoalCard({data}){

    let [goalTasks, setGoalTasks] = useState([])
    let [priority, setPriotity] = useState('')
    let [progressIndicator, setProgressIndicator] = useState('')
    let [color, setColor] = useState('black')

    useEffect(() => {
        getGoalTasks()

        if(data.priority === 'High') setPriotity("Wysoki")
        if(data.priority === 'Med') setPriotity("Średni")
        if(data.priority === 'Low') setPriotity("Niski")

            setProgressIndicator(() => {
                if(data.isOverdue){
                    setColor('red')
                    return "Przeterminowane"
                }else if(goalTasks.length < 1){
                    if(data.isCompleted){
                        setColor('green')
                        return "Wykonano"
                    }else{
                        return "Nie wykonano"
                    }
                }else if(goalTasks.length >= 1){
                    return `Postęp: ${data.progress}%` 
                }
            })
    }, [])

    function  getGoalTasks(){
        let goalId = data.id
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

    function changeIsCompleted(){
        let newIsCompleted = !data.isCompleted
        let now = new Date()
        now.setSeconds(0,0)
        let completionDate
        if(newIsCompleted){
            completionDate = now
        }else{
            completionDate = null
        }

        fetch(`http://localhost:5016/api/goals/update/${data.id}`, {
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

    function goToDetails(){
        sessionStorage.setItem('goalId', data.id)
        sessionStorage.setItem('lastPath', window.location.pathname)
        window.location.href = '/goal-details'
    }

    return(
        <div className="card">
            <h4>{data.title}</h4>
            <p>Początek: {data.startTime.replace("T", " ")}</p>
            <p>Koniec: {data.deadline.replace("T", " ")}</p>
            <p className="card-paragraph">{data.description}</p>
            <p className="card-paragraph">Priorytet: {priority}</p>
            <p style={{color: color}} className="card-paragraph">{progressIndicator}</p>

            <div className="btns-container">
                {progressIndicator == "Nie wykonano" ? <button onClick={changeIsCompleted} className="card-btn">WYKONANO</button> : null}
                <button onClick={goToDetails} className="card-btn">WIĘCEJ</button>
            </div>
        </div>
    )
}