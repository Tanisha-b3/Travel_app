import { ToastProvider } from '@radix-ui/react-toast'
import './App.css'
import Hero from './components/ui/custom/Hero'
import { Route, Routes } from 'react-router-dom'
import ViewTrip from './view_Trip/viewTrip'
import MyTrip from './components/ui/trip'
import Create_trip from './Trip/index'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/my-trips" element={
          <ProtectedRoute>
            <MyTrip />
          </ProtectedRoute>
        } />
        <Route path="/Create-trip" element={
          <ProtectedRoute>
            <Create_trip />
          </ProtectedRoute>
        } />
        <Route path="/View-Trip/:tripId" element={
          <ProtectedRoute>
            <ViewTrip />
          </ProtectedRoute>
        } />
      </Routes>
    </ToastProvider>
  )
}

export default App