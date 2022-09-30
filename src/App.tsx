import * as React from 'react'
import { PiletApi } from 'consolid-shell'
import Viewer from './components/'

const App = (props) => {
  return (
    <div id="viewer-module">
      <Viewer {...props}/>
    </div>
  )
}

export default App