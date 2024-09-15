// Import express, Request, Response, check, validationResult, User, bcrypt, and jwt
import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";

// Create a router
const router = express.Router();

// Define a POST route for logging in
router.post(
  "/login",
  [
    // Validate the email and password fields
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, return a 400 status with the error message
      return res.status(400).json({ message: errors.array() });
    }

    // Destructure the email and password from the request body
    const { email, password } = req.body;
    try {
      // Find the user in the database
      const user = await User.findOne({ email });
      if (!user) {
        // If the user does not exist, return a 400 status with the error message
        return res.status(400).json({ message: "User does not exist" });
      }

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // If the passwords do not match, return a 400 status with the error message
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      // Send the token as a cookie and respond with success
      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return res.status(200).json({ userId: user._id });
    } catch (error) {
      // Log the error and return a 500 status with the error message
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});
export default router;
