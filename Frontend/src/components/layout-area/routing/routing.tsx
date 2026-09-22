import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../pages-area/about/about";
import { Home } from "../../pages-area/home/home";
import { Page404 } from "../../pages-area/page404/page404";
import { Signup } from "../../pages-area/signup/signup";
import { Login } from "../../pages-area/login/login";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home: */}
            <Route path="/home" element={<Home />} />


            {/* About:  */}
            <Route path="/about" element={<About />} />
            {/* Sign up */}
            <Route path="/sign-up" element={<Signup />} />
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
