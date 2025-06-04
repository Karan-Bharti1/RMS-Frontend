import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
const router=createBrowserRouter([{
  path:"/dashboard",
  element:<App/>
},{
  path:"/login",
  element:<Login/>
},{
  path:"/register",
  element:<Register/>
},{
  path:"/",
  element:<Navigate to="/login"/>
}])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <RouterProvider router={router}/>
  </StrictMode>,
)
