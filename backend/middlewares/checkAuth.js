import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const checkAuth = async (req, res, next) => {
  console.log('i am in checkAuth');

  try {
    const token = req.cookies.jwt;


    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const id = decoded.id;
    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Not authenticated' });
  }
};
