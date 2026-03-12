import Weather from '../widgets/Weather/Weather'
import TodoList from '../widgets/TodoList/TodoList'
import NewsFeed from '../widgets/NewsFeed/NewsFeed'
import Notepad from '../widgets/Notepad/Notepad'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="widget widget--weather"><Weather /></div>
      <div className="widget widget--todo"><TodoList /></div>
      <div className="widget widget--news"><NewsFeed /></div>
      <div className="widget widget--notes"><Notepad /></div>
    </div>
  )
}

export default Dashboard
