import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "User not given"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email not given"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //   isVerified: {
  //     type: Boolean,
  //     default: false,
  //   },
  position: {
    type: String,

    enum: ["Admin", "Doctor", "Receptionist"],

    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
