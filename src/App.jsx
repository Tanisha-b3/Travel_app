import { ToastProvider } from '@radix-ui/react-toast'
import './App.css'
import Hero from './components/ui/custom/Hero'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ViewTrip from './view_Trip/viewTrip'

function App() {

  return (
    <>
      <ToastProvider>
        <Routes>
      
        <Route path="/my-trips" element={<ViewTrip/>} />

          <Route path="/" element={<Hero />} />
        </Routes>
      </ToastProvider>
    </>
  )
}

export default App
