import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "./components/layout-area/layout/layout";
import { store } from "./redux/store";
import { interceptor } from "./utils/interceptor";
import "./index.css";

// Registers the Axios interceptor before requests are sent.
interceptor.create();

// Renders the app with access to Redux and browser routing.
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    </Provider>
);