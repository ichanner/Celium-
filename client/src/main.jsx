import * as React from "react";
import * as ReactDOM from "react-dom/client";
import store from "./store/index"
import Router from "./pages/Router"
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById("root")).render(

  <Provider store={store}>

    <Router/>

  </Provider>
  
);