import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Join } from "./game/join";
import { Play } from "./game/play";
import { GameProvider } from "./hooks";
import { useFixVh } from "./hooks";

const App = () => {
  useFixVh();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameProvider />}>
          <Route index element={<Play />} />
          <Route path="join/:slug" element={<Join />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
