import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import Projects from './pages/manager/Projects.tsx'
import { ProjectsProvider } from './contexts/projectContext.tsx'

import { EngineerProvider } from './contexts/userContext.tsx'
import { AssignmentProvider } from './contexts/assignmentContext.tsx'
import Assignment from './pages/manager/Assignments.tsx'
import Profile from './pages/engineer/Profile.tsx'
import EngineerAssignments from './pages/engineer/EngineerAssignments.tsx'
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
},{
  path:"/assignments",
  element:<Assignment/>
},{
  path:"/engineer/profile",
  element:<Profile/>
},{
  path:"/engineer/assignments",
  element:<EngineerAssignments/>
}])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AssignmentProvider>
    <EngineerProvider>
    <ProjectsProvider>
      
    <RouterProvider router={router}/>
  
    </ProjectsProvider>
    </EngineerProvider>
     </AssignmentProvider>
  </StrictMode>,
)
