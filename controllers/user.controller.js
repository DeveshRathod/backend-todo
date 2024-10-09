import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 8 characters long" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userWithoutSensitiveData = {
      id: user.id,
      email: user.email,
    };

    res.status(201).json({
      msg: "User registered successfully",
      user: userWithoutSensitiveData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const userWithoutSensitiveData = {
      id: user.id,
      email: user.email,
    };

    res.status(200).json({
      msg: "User logged in successfully",
      user: userWithoutSensitiveData,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const checkMe = async (req, res) => {
  const temp = req.headers.authorization;
  const token = temp.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ msg: "Access denied" });
    }

    const userWithoutSensitiveData = {
      id: user.id,
      email: user.email,
    };

    res.status(200).json({ msg: "User found", user: userWithoutSensitiveData });
  } catch (error) {
    console.error("Error verifying token or finding user:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const location = async (req, res) => {
  res.status(200).send(process.env.LOCATION);
};
