const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please tell us your name"],
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            required: [true, "Please provide your email address"],
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        password: {
            type: String,
            required: [true, "A user must have a password"],
            minLength: [8, "Password must be at least 8 characters"],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
