import React, { useState } from 'react'
import API from '../api'

export default function Login({ onLogin, onSwitch }){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      const r = await API.post('/auth/login', { email, password });
      onLogin(r.data.token)
    }catch(e){ setErr(e.response?.data?.error || 'Login failed') }
  }

  return (
    <div className="auth">
      <h2>Sign In</h2>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <div className="hint">{err}</div>
      <button className="link" onClick={onSwitch}>Register</button>
    </div>
  )
}
