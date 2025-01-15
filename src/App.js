import './App.scss';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Home from './components/Home';
import AllGoalsPage from './components/AllGoalsPage';
import AllTasksPage from './components/AllTasksPage';
import GoalDetails from './components/GoalDetails';
import TaskDetails from './components/TaskDetails';
import AddEditNote from './components/AddEditNote';
import AddEditTask from './components/AddEditTask';
import AddEditGoal from './components/AddEditGoal';
import CalendarPage from './components/CalendarPage';
import NotificationsPage from './components/NotificationsPage';
import StatisticsPage from './components/StatisticsPage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/all-goals' element={<AllGoalsPage/>}/>
          <Route path='/all-tasks' element={<AllTasksPage/>}/>
          <Route path='/goal-details' element={<GoalDetails/>}/>
          <Route path='/task-details' element={<TaskDetails/>}/>
          <Route path='/add-edit-note' element={<AddEditNote/>}/>
          <Route path='/add-edit-task' element={<AddEditTask/>}/>
          <Route path='/add-edit-goal' element={<AddEditGoal/>}/>
          <Route path='/calendar-page' element={<CalendarPage/>}/>
          <Route path='/notifications-page' element={<NotificationsPage/>}/>
          <Route path='/statistics-page' element={<StatisticsPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
