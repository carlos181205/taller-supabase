// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword }  from './pages/ResetPassword'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path='/login'    element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password'  element={<ResetPassword />} />

          {/* Rutas protegidas – requieren sesión activa */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path='/'          element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/profile'   element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App