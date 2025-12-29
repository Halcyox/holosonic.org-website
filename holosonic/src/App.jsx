import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AcousticLevitation from './pages/AcousticLevitation';
import PrecisionManufacturing from './pages/PrecisionManufacturing';
import SyntheticBiology from './pages/SyntheticBiology';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology/acoustic-levitation" element={<AcousticLevitation />} />
        <Route path="/technology/precision-manufacturing" element={<PrecisionManufacturing />} />
        <Route path="/technology/synthetic-biology" element={<SyntheticBiology />} />
      </Routes>
    </div>
  );
}

export default App;
