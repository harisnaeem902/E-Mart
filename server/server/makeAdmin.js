require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const fixAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Hash the password properly using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("test123", salt);

    // Update or create admin@test.com with hashed password & isAdmin: true
    const updatedUser = await User.findOneAndUpdate(
      { email: "admin@test.com" },
      { 
        $set: { 
          name: "Admin User",
          password: hashedPassword, 
          isAdmin: true 
        } 
      },
      { new: true, upsert: true }
    );

    console.log(`Success! ${updatedUser.email} is now updated as Admin (isAdmin: ${updatedUser.isAdmin}).`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating admin user:", error.message);
    mongoose.connection.close();
  }
};

fixAdminUser();