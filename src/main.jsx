import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Create_trip from './Trip/index.jsx'
import Header from './components/ui/custom/Header.jsx'
import { Toaster } from "@/components/ui/toaster"
import ViewTrip from './view_Trip/viewTrip.jsx'
const router= createBrowserRouter([
  {
      path:'/',
      element:<App/>
  },
  {
    path:'Create-trip',
    element:<Create_trip/>
  },
  {
    path:'/View-Trip/:tripId',
    element:<ViewTrip/>
  }
]
)
createRoot(document.getElementById('root')).render(
  <>
  
  <StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_Auth_CLIENT_ID}>;

  <Header/>
  <Toaster/>
   <RouterProvider router={router}/>
   </GoogleOAuthProvider>
  </StrictMode>,
  </>
)
