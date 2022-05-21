import React from 'react';

import {BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';

const App = () => (
  <div>
    <Routes>
      <Route path="/" element={<Join />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  </div>
);

export default App;
