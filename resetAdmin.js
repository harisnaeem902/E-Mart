const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const resetAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is missing in your .env file.");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Enter your desired Admin credentials here:
    const ADMIN_EMAIL = "admin@gmail.com";
    const NEW_PASSWORD = "YourNewPassword123";

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // Update directly without triggering the pre('save') hook (prevents double hashing)
    const result = await User.findOneAndUpdate(
      { isAdmin: true },
      { 
        $set: { 
          email: ADMIN_EMAIL, 
          password: hashedPassword 
        } 
      },
      { new: true }
    );

    if (result) {
      console.log("✅ Admin account successfully updated!");
      console.log(`Email: ${ADMIN_EMAIL}`);
      console.log(`Password: ${NEW_PASSWORD}`);
    } else {
      console.log("❌ No user with isAdmin: true was found. Creating a new Admin account...");
      
      const newAdmin = new User({
        name: "Admin User",
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD, // Will be hashed by pre('save') hook on creation
        isAdmin: true,
      });

      await newAdmin.save();
      console.log("✅ New Admin account created successfully!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin:", error.message);
    process.exit(1);
  }
};

resetAdmin();