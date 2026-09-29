import { useState, type FormEvent } from "react";
import type { VacationModel } from "../../../models/vacation-model";
import { notify } from "../../../utils/notify";

type VacationFormProps = {
    vacation?: VacationModel;
    onSave: (data: FormData) => Promise<void>;
};

// Formats API dates for date inputs using the browser's local calendar date.
function toInputDate(value: string): string {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Displays shared add/edit fields and submits them as multipart form data.
export function VacationForm({ vacation, onSave }: VacationFormProps) {
    const isEditing = vacation !== undefined;
    const today = toInputDate(new Date().toISOString());
    const [startDate, setStartDate] = useState(vacation ? toInputDate(vacation.startDate) : "");
    const [isSaving, setIsSaving] = useState(false);

    // Sends the form fields and optional file to the page's save function.
    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        if (isSaving) return;

        const data = new FormData(event.currentTarget);
        const image = data.get("image");

        // Do not send an empty file when keeping the existing image.
        if (image instanceof File && image.size === 0) data.delete("image");

        setIsSaving(true);
        try {
            await onSave(data);
        }
        catch (error) {
            notify.error(error);
        }
        finally {
            setIsSaving(false);
        }
    }

    return (
        <form className="VacationForm" onSubmit={handleSubmit}>
            <fieldset disabled={isSaving}>
                <label htmlFor="destination">Destination:</label>
                <input id="destination" name="destination" defaultValue={vacation?.destination ?? ""} maxLength={100} required />

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" defaultValue={vacation?.description ?? ""} required />

                <label htmlFor="startDate">Start date:</label>
                <input id="startDate" name="startDate" type="date" value={startDate} onChange={event => setStartDate(event.target.value)} min={isEditing ? undefined : today} required />

                <label htmlFor="endDate">End date:</label>
                <input id="endDate" name="endDate" type="date" defaultValue={vacation ? toInputDate(vacation.endDate) : ""} min={startDate || (isEditing ? undefined : today)} required />

                <label htmlFor="price">Price:</label>
                <input id="price" name="price" type="number" defaultValue={vacation?.price ?? ""} min={0} max={10000} step="0.01" required />

                {vacation && <img src={vacation.imageUrl} alt={vacation.destination} width={240} />}

                <label htmlFor="image">{isEditing ? "Replace image (optional):" : "Image:"}</label>
                <input id="image" name="image" type="file" accept="image/*" required={!isEditing} />

                <button type="submit">{isSaving ? "Saving..." : isEditing ? "Save changes" : "Add vacation"}</button>
            </fieldset>
        </form>
    );
}