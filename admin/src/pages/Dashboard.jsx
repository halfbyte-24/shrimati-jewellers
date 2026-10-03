export default function Dashboard() {
  return (
    <div className="page-header">
      <h2>Dashboard</h2>
      <p>Welcome to the Shrimati Jewellers Admin Panel.</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-value">--</p>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <p className="stat-value">--</p>
        </div>
        <div className="stat-card">
          <h3>Featured</h3>
          <p className="stat-value">--</p>
        </div>
      </div>
    </div>
  )
}
