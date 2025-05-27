import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ErrorPage from './pages/ErrorPage.jsx'
import MainLayout from './components/MainLayout.jsx'


// #
function App({}) {
  const jwtKey = "jsonwebtoken";

    //#
    function isUsernameValid(username, setErrorMsg){
      const MIN_USERNAME_LEN = 3;
      const trimmed = username.trim()

      if(trimmed.length <= MIN_USERNAME_LEN){
        setErrorMsg(`Username too short, minimum length must be ${MIN_USERNAME_LEN} NOT ${trimmed.length}.`);
        return false;
      }
      
      return true;
    }

  //#
const router = createBrowserRouter([
  { path: '*', element: <ErrorPage /> },
  {
    path: '/home',
    element: <MainLayout jwtKey={jwtKey} />,
    children: [
      { path: '', element: <HomePage jwtKey={jwtKey} /> },
      { path: 'profile', element: <ProfilePage jwtKey={jwtKey} /> }, 
    ],
  },
  {
    path: '/login',
    element: (
      <LoginPage
        isUsernameValid={isUsernameValid}
        jwtKey={jwtKey}
      />
    ),
  },
  {
    path: '/register',
    element: (
      <RegisterPage
        isUsernameValid={isUsernameValid}
        jwtKey={jwtKey}
      />
    ),
  },
  { path: '/', element: <AuthPage jwtKey={jwtKey} /> },
]);


  return (
    <RouterProvider router={router}/>
  )
}

export default App;
