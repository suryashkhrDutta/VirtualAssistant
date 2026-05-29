import React, { useContext } from 'react';
import SignIn from './pages/Signin';
import Signup from './pages/Signup';
import { Route, Routes,Navigate } from 'react-router-dom';
import Customize from './pages/Customize';
import { userDataContext } from './context/userContext';
import Home from './pages/Home';


function App() {
  const {userData, setUserData} = useContext(userDataContext)
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to={"/customize"} />} />
      <Route path = '/signup' element = { !userData ? <Signup/> : <Navigate to={"/"} /> }/>
      <Route path = '/signin' element = { !userData ? <SignIn/> : <Navigate to={"/"} /> }/>
      <Route path = '/customize' element = {userData ? <Customize/> : <Navigate to={"/signin"} /> }/>
    </Routes>
  )
}
export default App;
