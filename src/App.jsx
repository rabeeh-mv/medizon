import { useState } from 'react'

import Admin from './operations/admin'
import Addstd from './Addstd/Addstd'
import Home from './operations/Home'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './auth/Login';
import "./index.css"
function App() {

  return (
<>
{/* <Admin/> */}
<BrowserRouter>
<Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
</BrowserRouter>
</>
  )
}

export default App
