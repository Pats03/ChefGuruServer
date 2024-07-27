import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {
  HomeLayout,
  Home,
  Error,
  Login
} from './pages'


const router = createBrowserRouter([
  {
    path: '/',  
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />
      }
    ]
  }
])


function App() {
return (
  <>
    <RouterProvider router={router} />
  </>
)
}

export default App