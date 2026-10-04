import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, List, Package, Settings, LogOut, Tag } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/admin/login')
    } catch (error) {
      console.error('Error logging out:', error.message)
    }
  }

  const navItems = [
    { to: '/admin/categories', icon: <List size={20} />, label: 'Categories' },
    { to: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { to: '/admin/offers', icon: <Tag size={20} />, label: 'Offers & Discounts' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ]

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Shrimati Admin</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>Admin Portal</h1>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  )
}
