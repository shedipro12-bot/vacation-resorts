import { Navigate, Route, Routes } from "react-router-dom";
import { About } from "../../pages-area/about/about";
import { Data } from "../../pages-area/data/data";
import { Home } from "../../pages-area/home/home";
import { Page404 } from "../../pages-area/page404/page404";
import { Signup } from "../../pages-area/signup/signup";

export function Routing() {

    return (
        <Routes>

            {/* Default Route: */}
            <Route path="/" element={<Navigate to="/home" />} />

            {/* Home: */}
            <Route path="/home" element={<Home />} />

            {/* Data:  */}
            <Route path="/data" element={<Data />} />

            {/* About:  */}
            <Route path="/about" element={<About />} />
            {/* Sign up */}
            <Route path="/sign-up" element={<Signup />} />

            {/* Page not found: */}
            <Route path="*" element={<Page404 />} />

        </Routes>
    );
}
