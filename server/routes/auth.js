const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../models/User");
const { model } = require("mongoose");

// CONFIGURATION MULTER FOR FILE UPLOAD
const storage = multer.diskStorage({
  destination: function (req, files, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//USER REGISTER
router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    //PATH TO THE UPLAODED PROFILE PHOTO
    const profileImagePath = profileImage.path;

    //EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exist." });
    }

    //HASH PASSWORD
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //NEW USER
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImage,
    });

    //SAVE USER
    await newUser.save();

    res
      .status(200)
      .json({ message: "User registration successfully.", user: newUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed.", error: err.message });
  }
});

module.exports = router;
