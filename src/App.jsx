import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GameIndex, NewGame, Join, Play } from './game'
import { GameProvider } from './hooks'
import { useFixVh } from './hooks'

const App = () => {
  useFixVh()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<NewGame />}/>
          <Route path="join" element={<Join />} />
          <Route path="game/*">
            <Route path="new" element={<NewGame />} />
            <Route path=":game/*" element={<GameProvider />}>
              <Route index element={<Play/>} />
              <Route path="join" element={<Join />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
