const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (username, password, email) => {
  try {
    // Check if the username already exists
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      console.log('Username already exists');
      throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const insertUserResult = await new Promise((resolve, reject) => {
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
    const userId = insertUserResult.insertId;

    const insertProfileResult = await new Promise((resolve, reject) => {
      db.query('INSERT INTO profiles (user_id, email) VALUES (?, ?)', [userId, email], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const token = 'test_token';

    const user = { userId, username, token };

    console.log('User registered successfully:', user);

    // Return the user data
    return user;

  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};


const getUserByUsername = async (username) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0]);
      }
    });
  });
};


const updateUser = async (userId, newUserData) => {
  try {
    const { email, profile_image, detail } = newUserData;

    // Update user profile in the database
    const updateResult = await new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE profiles SET email=?, profile_image=?, detail=? WHERE user_id=?';

      const updateData = [email, profile_image, detail, userId];

      db.query(updateQuery, updateData, async (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Fetch updated user details from the database
          const updatedUser = await getUserById(userId);

          resolve(updatedUser);
        }
      });
    });

    console.log('User profile updated successfully:', updateResult);

    return updateResult;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};


const deleteUser = async (userId) => {
  try {
    // Delete user from the database
    const deleteResult = await new Promise((resolve, reject) => {
      db.query('DELETE FROM users WHERE user_id=?', [userId], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    console.log('User deleted successfully:', deleteResult);


    return { message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

const getUserById = async (userId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT users.*, profiles.email, profiles.profile_image, profiles.detail FROM users LEFT JOIN profiles ON users.user_id = profiles.user_id WHERE users.user_id = ?', [userId], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0]);
      }
    });
  });
};



module.exports = {
  createUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUserById
};