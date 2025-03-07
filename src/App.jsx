import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NewGame, Join, Play } from "./game";
import { GameProvider } from "./hooks";
import { useFixVh } from "./hooks";

const App = () => {
  useFixVh();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameProvider />}>
          <Route index element={<Play />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
