import { UserModel } from "../../../models/user-model";
import "./signup.css";
import {useForm} from "react-hook-form"

export function Signup() {
    // const {register, handleSubmit} = useForm<UserModel>("");

    return (
        <div className="Signup">


           <label>First name:</label>
           <input type="text"  required/>
           <br/>

           <label>Last Name:</label>
           <input type="text" required />
           <br/>

           <label>Email:</label>
           <input type="email"  required/>
           <br/>

           <label>Password: </label>
           <input type="password" required  />
           <br/>

           <button>Register</button>

        </div>
    );
}
