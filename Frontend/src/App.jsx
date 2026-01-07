import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import {Editor} from './pages/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/editor/:roomId' element={<Editor/>}></Route>   {/* this is for the redirecting to the room id */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
