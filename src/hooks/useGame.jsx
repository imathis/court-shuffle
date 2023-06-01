import React from 'react'
import { GameContext } from './GameProvider'

export const useGame = () => React.useContext(GameContext)
