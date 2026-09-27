import "./edit-vacation.css";
import { useAdmin } from "../../../hooks/use-admin";
export function EditVacation() {
    const isAdmin = useAdmin();



    if (!isAdmin) return "You're Not Permitted";
    return (
        <div className="EditVacation">

            <p>EditVacation Component</p>

        </div>
    );
}
