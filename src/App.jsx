import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { isAuthenticated, logout } = useAuth()

  return isAuthenticated
    ? <Dashboard onLogout={logout} />
    : <Login />
}
