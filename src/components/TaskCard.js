import { useState, useEffect } from "react"

export default function TaskCard({data}){
    let [progressIndicator, setProgressIndicator] = useState('')
    let [color, setColor] = useState('black')

    useEffect(() => {
        setProgressIndicator(() => {
            if(data.isOverdue){
                setColor('red')
                return "Przeterminowane"
            }else{
                if(data.isCompleted){
                    setColor('green')
                    return "Wykonano"
                }else{
                    return "Nie wykonano"
                }
            }
        })
    }, [])

    function goToDetails(){
        sessionStorage.setItem('taskId', data.id)
        sessionStorage.setItem('lastPath', window.location.pathname)
        window.location.href = '/task-details'
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

        fetch(`http://localhost:5016/api/tasks/update/${data.id}`, {
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
        <div className="card">
            <h4>{data.title}</h4>
            <p>Początek: {data.startTime.replace("T", " ")}</p>
            <p>Koniec: {data.deadline.replace("T", " ")}</p>
            <p className="card-paragraph">{data.description}</p>
            {/* {data.isCompleted ? <p>Wykonano</p> : null} */}
            <p style={{color: color}} className="card-paragraph">{progressIndicator}</p>
            <div className="btns-container">
            {progressIndicator == "Nie wykonano" ? <button onClick={changeIsCompleted} className="card-btn">WYKONANO</button> : null}
            <button onClick={goToDetails} className="card-btn">WIĘCEJ</button>
            </div>
        </div>
    )
}