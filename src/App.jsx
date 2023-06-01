import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GameIndex, Setup, NewGame, Join, Play } from './game'
import { GameProvider } from './hooks'

const App = () => (
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<GameIndex />}/>
          <Route path="join" element={<Join />} />
          <Route path="game/*">
            <Route path="new" element={<NewGame />} />
            <Route path=":game/*" element={<GameProvider />}>
              <Route index element={<Play/>} />
              <Route path="setup" element={<Setup/>} />
              <Route path="join" element={<Join />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
)

export default App;
