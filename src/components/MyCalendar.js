import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, min } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { id, pl } from 'date-fns/locale';


export default function MyCalendar({ goals, tasks, size }){
    const [currentDate, setCurrentDate] = useState(new Date()); 

    let localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), {locale: pl}),
        getDay,
        locales: { 'pl': pl }
    })

    let messages = {
        date: 'Data',
        time: 'Czas',
        event: 'Wydarzenie',
        allDay: 'Cały dzień',
        week: 'Tydzień',
        work_week: 'Tydzień roboczy',
        day: 'Dzień',
        month: 'Miesiąc',
        previous: 'Poprzedni',
        next: 'Następny',
        yesterday: 'Wczoraj',
        tomorrow: 'Jutro',
        today: 'Dzisiaj',
        agenda: 'Agenda',
        noEventsInRange: 'Brak wydarzeń w tym zakresie dat.',
        showMore: (count) => `+${count} więcej`,
    }
    
    let [calendarEvents, setCalendarEvents] = useState([])

    useEffect(() => {
       let mappedGoals = goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        start: new Date(goal.startTime),
        end: new Date(goal.deadline),
        type: 'goal'
       })) 
       let mappedTasks = tasks.map(task => ({
        id: task.id,
        title: task.title,
        start: new Date(task.startTime),
        end: new Date(task.deadline),
        type: 'task' 
    }))
        setCalendarEvents([...mappedGoals, ...mappedTasks]);
    }, [goals, tasks])

    let handleNavigate = (newDate, view) => {
        setCurrentDate(newDate);  
    }

    let goToDetails = (event) => {
        let type = event.type
        let id = event.id
        if(type == 'goal'){
            sessionStorage.setItem('goalId', id)
            window.location.href = '/goal-details'
        }else{
            sessionStorage.setItem('taskId', id)
            window.location.href = '/task-details'
        }
    }

    return(
        <div style={{height: size, width: size}}>
            <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{height: "100%"}}
                views={['month']}
                defaultView="month" 
                onSelectEvent={(event) =>goToDetails(event)} 
                onNavigate={handleNavigate} 
                date={currentDate} 
                messages={messages}
                eventPropGetter={(event) => {
                    if (event.type === 'goal') {
                        return {
                            style: {
                                backgroundColor: 'blue',
                                color: 'white'
                            }
                        };
                    } else if (event.type === 'task') {
                        return {
                            style: {
                                backgroundColor: 'green', 
                                color: 'white'
                            }
                        };
                    }
                    return {}
                }}
            />
        </div>
    )
}