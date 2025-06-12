import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Join } from "@/pages/Join";
import { Landing } from "@/pages/Landing";
import { New } from "@/pages/New";
import { Play } from "@/pages/Play";
import { useFixVh } from "@/hooks/useFixVh";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  useFixVh();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Landing />} />
          <Route path="new" element={<New />} />
          <Route path="play" element={<Play />} />
          <Route path="join/:slug" element={<Join />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
