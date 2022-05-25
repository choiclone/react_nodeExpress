import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StationList from "./list/StationList";
import TestJ from "./list/StationListF";
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route exact path='/search' element={<StationList/>} />
          <Route exact path='/' element={<TestJ/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
