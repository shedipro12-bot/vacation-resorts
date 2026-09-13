import { NavLink } from "react-router-dom";
import "./menu.css";

export function Menu() {

    return (
        <div className="Menu">

            <NavLink to="/home">Home</NavLink>

            <NavLink to="/data" end>Data</NavLink>
            
            <NavLink to="/about">About</NavLink>
            <NavLink to="/sign-up">Sign-up</NavLink>

        </div>
    );
}
