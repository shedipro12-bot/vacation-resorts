import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Layout } from "./components/layout-area/layout/layout";
import { store } from "./redux/store";
import { interceptor } from "./utils/interceptor";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./utils/theme";
import { userService } from "./services/user-service";
userService.restoreSession();
// Registers the Axios interceptor before requests are sent.
interceptor.create();

// Renders the app with access to Redux and browser routing.
createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>
);