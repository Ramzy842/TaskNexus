import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./redux/rootReducer.js";

export const store = createStore(rootReducer, applyMiddleware(logger, thunk));
// store.subscribe(() => {
//   console.log(store.getState());
// });
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
