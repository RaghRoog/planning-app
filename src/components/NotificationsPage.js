import NavBar from "./NavBar";
import { useState, useEffect, useRef } from "react";

export default function NotificationsPage() {
    let [userTasks, setUserTasks] = useState([])
    let [notifications, setNotifications] = useState([])
    let [title, setTitle] = useState('')
    let [datetime, setDatetime] = useState('')

    let notidicationsTimers = useRef({})

    useEffect(() => {
        getUserTasks()
    }, [])

    useEffect(() => {
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                alert('Aplikacja potrzebuje uprawnień do powiadomień.')
            }
        })

        let savedNotifications = JSON.parse(localStorage.getItem('notifications')) || []
        setNotifications(savedNotifications)

        savedNotifications.forEach(scheduleNotification)
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
            .then(json => setUserTasks(json.filter(task => (task.isCompleted === false && task.isOverdue === false))))
            .catch(error => {
                console.log(error)
                setUserTasks([])
            })
    }

    function addNotification(){
        if (!title || !datetime) {
            alert('Wszystkie pola muszą być wypełnione!')
            return
        }

        let notifyAt = new Date(datetime).getTime()
        let now = Date.now()

        if (notifyAt <= now) {
            alert('Nie możesz ustawić powiadomienia w przeszłości!')
            return
        }

        let newNotification = {
            id: `${notifyAt}-${Math.random()}`,
            title, 
            notifyAt 
        }

        let updatedNotifications = [...notifications, newNotification]
        setNotifications(updatedNotifications)

        localStorage.setItem('notifications', JSON.stringify(updatedNotifications))

        scheduleNotification(newNotification);

        setTitle('')
        setDatetime('')

        let defaultOption = document.getElementById('default-option')
        defaultOption.selected = true
    }

    function scheduleNotification(notification){
        let delay = notification.notifyAt - Date.now()
        let timerId = setTimeout(() => {
            new Notification(notification.title)
            removeNotification(notification)
        }, delay)
        notidicationsTimers.current[notification.id] = timerId
    }

    function removeNotification(notificationToRemove){
        if(notidicationsTimers.current[notificationToRemove.id]){
            clearTimeout(notidicationsTimers.current[notificationToRemove.id])
            delete notidicationsTimers.current[notificationToRemove.id]
        }
        let updatedNotifications = notifications.filter(
            notif => notif.id !== notificationToRemove.id
        )
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
    }

    return (
        <>
            <NavBar />
            <div className="main">
                <h2>Zarządzanie powiadomieniami</h2>
                <h3>Dodaj powiadomienie</h3>
                <form style={{alignItems: 'flex-start'}}>
                    <select onChange={(e) => setTitle(e.target.value)}>
                        <option id="default-option" selected disabled>Wybierz zadanie</option>
                        {userTasks.map(task => (
                            <option key={task.id} value={task.title}>{task.title}</option>
                        ))}
                    </select>                   
                    <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)}/>
                </form>
                <button onClick={addNotification}>Dodaj powiadomienie</button>

                <div>
                    <h3 style={{marginTop: '24px'}}>Twoje powiadomienia</h3>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "24px"}}>
                        {notifications.map(notif => (
                            <div key={notif.id} style={{marginBottom: '10px', boxShadow: '0px 1px 2px 0px lightgray', padding: '10px'}}>
                                <p>
                                    <strong>{notif.title}</strong>
                                </p>
                                <p>
                                    Data: {new Date(notif.notifyAt).toLocaleDateString()} Godzina: {new Date(notif.notifyAt).toLocaleTimeString()}
                                </p>
                                <button onClick={() => removeNotification(notif)}>Usuń</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
