import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/use-admin";
import { vacationService } from "../../../services/vacation-service";
import { VacationForm } from "../../vacation-area/vacation-form/vacation-form";
import "./add-vacation.css";

// Allows admins to create a vacation.
export function AddVacation() {
    const isAdmin = useAdmin();
    const navigate = useNavigate();

    // Creates the vacation and returns to the list.
    async function handleSave(data: FormData): Promise<void> {
        await vacationService.addVacation(data);
        navigate("/vacations");
    }

    if (!isAdmin) return null;

    return (
        <div className="AddVacation">
            <h1>Add Vacation</h1>
            <VacationForm onSave={handleSave} />
        </div>
    );
}