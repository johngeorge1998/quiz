import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

/**
 * Generate a JWT with a 30-day expiration
 */
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

/**
 * Persist JWT in a secure HttpOnly cookie to mitigate XSS-based token theft
 */
const setTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ 
        success: false, 
        message: 'An account with this email already exists.' 
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);
      
      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        }
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Invalid user data provided.' 
      });
    }
  } catch (error) {
    console.error('[Auth Service]: Registration failure', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration. Please try again.' 
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }
  } catch (error) {
    console.error('[Auth Service]: Login failure', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login. Please try again.' 
    });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ 
    success: true, 
    message: 'Logged out successfully.' 
  });
};

export const getMe = async (req: Request | any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user profile.' 
    });
  }
};
