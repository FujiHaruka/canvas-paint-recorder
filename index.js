import './style'
import { Component } from 'preact'
import State from './State'
import {
  Canvas
} from './components'

@State
export default class App extends Component {
  render ({
    drawing,
    prevX,
    prevY,
    // -- handlers --
    toggleDrawing,
    setPrevCoord
  }) {
    return (
      <div>
        <Canvas {...{drawing, prevX, prevY, toggleDrawing, setPrevCoord}} />
      </div>
    )
  }
}
