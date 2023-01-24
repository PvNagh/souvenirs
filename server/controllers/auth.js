import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//signUp 

export const signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);//201 created
  } catch (err) {
    res.status(500).json({ error: err.message });//500 Internal Server Error
  }
};

//login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "Email does not exist. " });
    }
    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return res.status(400).json({ msg: "Invalid credentials. " });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_CONFIDENTIAL);
    delete user.password;
    res.status(200).json({ token, user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}