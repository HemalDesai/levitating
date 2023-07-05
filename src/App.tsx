import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import MultiStepForm from './Homepage';

const App: React.FC = () => {
  const [token, setToken] = useState('');
  const handleSetToken = (newToken: string) => {
    setToken(newToken);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={handleSetToken} />} />
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/homepage" element={<MultiStepForm token={token} />} />
      </Routes>
    </Router>
    
  );
};

export default App;
