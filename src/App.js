import logo from './logo.svg';
import './App.css';
import Login from './components/login';
import Gamepage from './components/gamepage';
import {Routes,Route} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/puzzle" element={<Gamepage />} />
      </Routes>
    </div>
  );
}

export default App;