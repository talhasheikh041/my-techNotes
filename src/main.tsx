import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import { Provider } from "react-redux"
import { store } from "./app/store.ts"
import React from "react"
import { disableReactDevTools } from "@fvilers/disable-react-devtools"

if (import.meta.env.MODE === "production") disableReactDevTools()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
