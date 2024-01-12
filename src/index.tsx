import * as React from 'react';
import { PiletApi } from 'consolid-shell';
import App from './App'

export function setup(app: PiletApi) {
  const constants = app.getData("CONSTANTS")
  const connect = app.makeState(app, constants)
  const Module = connect(({ state, actions }) => app.withState(App, { app, state, actions }))
  app.showNotification(`Hello from ${app.meta.name} component!`, {
    autoClose: 2000,
  });
  app.registerTile(Module, {
    initialColumns: 8,
    initialRows: 8,
    resizable: false
  })
  app.registerExtension(app.meta["link"], Module)
  
}
