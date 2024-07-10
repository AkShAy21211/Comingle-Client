import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Redux/store.ts";
import ToastProvider from "./Components/Common/ToastProvider.tsx";
import { registerServiceWorker } from '../serviceWorkerRegistration.ts';
import CustomErrorBoundary from "./Components/ErrorBoundary.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <ToastProvider>
        {/* <CustomErrorBoundary> */}
          <App />
        {/* </CustomErrorBoundary> */}
      </ToastProvider>
    </Provider>
);

registerServiceWorker()