import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
        <AuthProvider>
    <Router>
      <Routes>
        <Route exact path='/signup' Component={Signup} />
        <Route exact path='/login' Component={Login} />
        <Route exact path='/' Component={Home} />
      </Routes>
    </Router>
        </AuthProvider>
  );
}

export default App;
