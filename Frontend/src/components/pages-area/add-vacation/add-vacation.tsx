import { useAdmin } from "../../../hooks/use-admin";
import "./add-vacation.css";

// Displays the add-vacation page only to admins.
export function AddVacation() {
    const isAdmin = useAdmin();

   
    if (!isAdmin) return null;

    return (
        <div className="AddVacation">
            <h1>Add Vacation</h1>
        </div>
    );
}