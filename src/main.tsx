import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import ToastProvider from "./Components/Common/ToastProvider.tsx";
import { registerServiceWorker } from './serviceWorkerRegistration.ts';


ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <ToastProvider>
          <App />
      </ToastProvider>
    </Provider>
);

registerServiceWorker()