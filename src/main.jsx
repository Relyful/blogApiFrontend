import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './components/Header/Header.jsx'
import LogIn from './components/LogIn/LogIn.jsx'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom"

const router = createBrowserRouter([
  {
    path:"/",
    element: <Header />,
    children: [
      { path: "login", element: <LogIn /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
