import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
function home() {
  return (
    <div>
      home
      <nav>
        <Link to="/">home</Link> | <Link to="/admin">Admin</Link> 
      </nav>
    </div>
  )
}

export default home
