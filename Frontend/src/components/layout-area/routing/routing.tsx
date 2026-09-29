import { Navigate, Route, Routes } from "react-router-dom";
import { Vacations } from "../../pages-area/vacations/vacations";
import { AddVacation } from "../../pages-area/add-vacation/add-vacation";
import { EditVacation } from "../../pages-area/edit-vacation/edit-vacation";
import { AdminReport } from "../../pages-area/admin-report/admin-report";
import { AI } from "../../pages-area/ai/ai";
import { Mcp } from "../../pages-area/mcp/mcp";
import { Page404 } from "../../pages-area/page404/page404";
import { Signup } from "../../user-area/sign-up/sign-up";
import { SignIn } from "../../user-area/sign-in/sign-in";

// Maps browser URLs to page components; each protected page checks access.
export function Routing() {
    return (
        <Routes>
            {/* Vacations */}
            <Route path="/" element={<Navigate to="/vacations" replace />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/vacations/new" element={<AddVacation />} />
            <Route path="/vacations/edit/:vacationId" element={<EditVacation />}
            />
            {/* Signup/Login */}

            <Route path="/sign-up" element={<Signup />} />
            <Route path="/sign-in" element={<SignIn />} />

            <Route path="/admin-report" element={<AdminReport />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/mcp" element={<Mcp />} />

            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}