import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StationList from "./list/StationList";
import StationArriveBusInfo from "./list/StationArriveBusInfo";
import TestJ from "./list/StationListF";
import './App.css';
import "../src/css/Main.css"

const App = () => {
  return (
    <div className='main-fullScreen'>
      <Router>
        <Routes>
          <Route exact path='/list' element={<StationList/>} />
          <Route exact path='/BusInfo' element={<StationArriveBusInfo/>} />
          <Route exact path='/' element={<TestJ/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
