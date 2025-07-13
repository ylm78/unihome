import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' });

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    const token = createToken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw Error('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error('Incorrect password');
    const token = createToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
