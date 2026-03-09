import './Dashboard.css'

function Dashboard({ onHome }) {
  return (
    <div className="dashboard">
      <p className="dashboard__coming-soon">Dashboard coming soon</p>
      <button className="dashboard__home-btn" onClick={onHome}>← Home</button>
    </div>
  )
}

export default Dashboard
