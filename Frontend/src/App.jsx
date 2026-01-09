import { useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { Toaster } from 'react-hot-toast'
import SocketContext from '../context/SocketContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toaster></Toaster>
      <SocketContext>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/editor/:roomId' element={<EditorPage/>}></Route>   {/* this is for the redirecting to the room id */}
        </Routes>
      </BrowserRouter>
      </SocketContext>
    </>
  )
}

export default App
