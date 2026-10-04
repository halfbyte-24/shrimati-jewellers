import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Settings from './pages/Settings'
import Offers from './pages/Offers'
import './index.css'

export default function AdminApp() {
  return (
    <div className="admin-app">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route index element={<Navigate to="categories" replace />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="offers" element={<Offers />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}
