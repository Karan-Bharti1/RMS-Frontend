import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Projects from './pages/manager/Projects.tsx'
import { ProjectsProvider } from './contexts/projectContext.tsx'
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
},{
  path:"/projects",
  element:<Projects/>
}])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProjectsProvider>
    <RouterProvider router={router}/>
    </ProjectsProvider>
  </StrictMode>,
)
