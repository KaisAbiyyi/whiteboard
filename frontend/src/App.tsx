// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './router/Home';
import Whiteboard from './router/Whiteboard';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Route>
    </Routes>
  );
}

export default App;
