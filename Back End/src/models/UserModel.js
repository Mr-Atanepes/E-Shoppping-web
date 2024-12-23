import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 }, // Set maximum length
    password: { type: String, required: true, minlength: 6, maxlength: 128 }, // Add length validation
    email: { type: String, required: true, unique: true, maxlength: 100 }, // New email field
    isAdmin: { type: Boolean, default: false }, // Add isAdmin field to identify admin users
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    resetPasswordToken: { type: String }, // Add this field to store reset password token
    resetPasswordExpires: { type: Date }, // Add expiration for the reset token
  },
  { timestamps: true } // Add timestamps
);

// Hash password before saving (ensure `this` references the correct document)
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
