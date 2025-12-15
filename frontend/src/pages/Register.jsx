import React, { useState } from 'react'
import API from '../api'

export default function Register({ onRegister, onSwitch }){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [name,setName]=useState('')
  const [err,setErr]=useState('')

  async function submit(e){
    e.preventDefault(); setErr('')
    try{
      const r = await API.post('/auth/register', { email, password, name });
      onRegister(r.data.token)
    }catch(e){ setErr(e.response?.data?.error || 'Register failed') }
  }

  return (
    <div className="auth">
      <h2>Create Account</h2>
      <form onSubmit={submit}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="hint">{err}</div>
      <button className="link" onClick={onSwitch}>Back to Login</button>
    </div>
  )
}
