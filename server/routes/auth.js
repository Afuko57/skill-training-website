const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserByUsername,
  updateUser,
  getUserById,
  deleteUser,
} = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Registration failed
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = await createUser(username, password, email);

    console.log("User registered successfully:", user);
    console.log("TOKEN_KEY:", process.env.TOKEN_KEY);

    res.status(201).json({ message: "ลงทะเบียนผู้ใช้สำเร็จ" });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate username error
    if (error.message === "Username already exists") {
      return res.status(400).json({ error: "Username already exists" });
    }

    res.status(500).json({ error: "การลงทะเบียนล้มเหลว" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Login failed
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);

    console.log("Username:", username);
    console.log("Input Password:", password);
    console.log("User from DB:", user);

    if (!(user && password)) {
      return res.status(401).json({ error: "All input is require" });
    }

    if (!user) {
      return res.status(401).json({ error: "Authentication failed, User " });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed, Password" });
    }

    const token = jwt.sign({ userId: user.id }, "your-secret-key", {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Swagger Documentation
/*
 * @swagger
 * /auth/update/{userId}:
 *   put:
 *     summary: Update user information
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
 *       - in: body
 *         name: body
 *         required: true
 *         description: User data to update
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The new username of the user.
 *             password:
 *               type: string
 *               description: The new password of the user.
 *             email:
 *               type: string
 *               description: The new email of the user.
 *             profile_image:
 *               type: string
 *               description: The new profile image URL of the user.
 *             detail:
 *               type: string
 *               description: The new detail field of the user.
 *     responses:
 *       200:
 *         description: User updated successfully
 *       500:
 *         description: Update failed
 */
router.put("/update/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, password, email, profile_image, detail } = req.body;
    const newUserData = { username, password, email, profile_image, detail };

    const updatedUser = await updateUser(userId, newUserData);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

/**
 * @swagger
 * /auth/delete/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       500:
 *         description: Deletion failed
 */
router.delete('/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const deleteResult = await deleteUser(userId);

    res.status(200).json(deleteResult);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Deletion failed' });
  }
});

/**
 * @swagger
 * /auth/profile/{userId}:
 *   get:
 *     summary: Get user profile by user ID
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to get profile
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User profile not found
 *       500:
 *         description: Fetching profile failed
 */
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await getUserById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Fetching profile failed" });
  }
});

module.exports = router;
