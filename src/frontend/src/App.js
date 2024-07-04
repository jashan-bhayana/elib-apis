import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import Register from './components/Register';

function App() {
  return (
   <BrowserRouter>
    <Routes>
      
        <Route path='/' element={<Register />} />
      
    </Routes>
   </BrowserRouter>
  );
}

export default App;
