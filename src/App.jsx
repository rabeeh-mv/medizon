import { useState } from 'react'

import Admin from './operations/admin'
import Addstd from './Addstd/Addstd'
import Home from './operations/Home'
import { BrowserRouter, Routes, Route } from "react-router";

function App() {

  return (
<>
{/* <Admin/> */}
<BrowserRouter>
<Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
</BrowserRouter>
</>
  )
}

export default App
