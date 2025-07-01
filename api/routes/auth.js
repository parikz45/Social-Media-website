const router = require("express").Router();
const User = require('../Models/User');
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    console.log("✅ New user saved:", user);
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json(err);
  }
});


//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body); // 🪵 LOG INPUT

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("LOGIN ERROR:", err); // 🪵 LOG ACTUAL ERROR
    return res.status(500).json("Internal Server Error");
  }
});


module.exports = router;