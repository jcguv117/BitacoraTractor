import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import DtMovimientos from './components/DtMovimientos'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar/>
      <DtMovimientos/>
    </div>
  )
}

export default App
