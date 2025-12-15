import React, { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [view, setView] = useState(token ? 'home' : 'login')

  useEffect(()=>{ localStorage.setItem('token', token || '') },[token])

  if (!token) {
    return view === 'login' ? <Login onLogin={t=>{setToken(t); setView('home')}} onSwitch={()=>setView('register')}/> : <Register onRegister={t=>{setToken(t); setView('home')}} onSwitch={()=>setView('login')} />
  }

  return (
    <>
      {view === 'home' && <Home onNavigate={(page) => setView(page)} />}
      {view === 'dashboard' && <Dashboard onNavigateTo={(page) => setView(page)} onLogout={()=>{setToken(null); setView('login')}} />}
    </>
  )
}
