const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const generateToken = (user) => {
  const id = user.id || user._id.toString();
  return jwt.sign(
    { id, email: user.email },
    process.env.JWT_SECRET || 'default_super_secret_key_change_me_in_production',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: hashedPassword
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: newUser.id || newUser._id.toString(),
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server registration error. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id || user._id.toString(),
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server login error. Please try again.' });
  }
};
