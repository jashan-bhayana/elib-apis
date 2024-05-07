import mongoose, { model } from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //it checks for whether user is using same email again
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//users 
export default mongoose.model<User>('User' , userSchema);

//export default userSchema;
