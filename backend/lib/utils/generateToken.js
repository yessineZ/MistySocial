import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (id, res) => {
  const time = 60 * 60 * 24; // 24 hours in seconds
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: time,
  }); 

  res.cookie('jwt', token, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + time * 1000), 
    secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
  }); 
};
