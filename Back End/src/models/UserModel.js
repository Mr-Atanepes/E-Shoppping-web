import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
const { isEmail } = validator;

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, maxlength: 50 },
    password: { type: String, required: true, minlength: 6, maxlength: 128 },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      maxlength: 100,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Please enter a valid email format',
      }
    },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Password hashing before saving user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Add login method for user verification
userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('Incorrect username');
  }
  
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw new Error('Invalid password');
  }
  
  return user; // Return the user object if credentials are valid
};

const User = mongoose.model("User", userSchema);

export default User;
