import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom"
import './index.css'
import Header from './components/Header/Header.jsx'
import LogIn from './components/LogIn/LogIn.jsx'
import Posts from './components/Posts/Posts.jsx'
import Post from './components/Post/Post.jsx'
import Register from './components/Register/Register.jsx'
import Home from './components/Home/Home.jsx';

const router = createBrowserRouter([
  {
    path:"/",
    element: <Header />,
    children: [
      {index: true, element: <Home />},
      {path: "posts", element: <Posts />},
      {path: "login", element: <LogIn />},
      {path: "posts/:postId", element: <Post />},
      {path: "register", element: <Register />},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
