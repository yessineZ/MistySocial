import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (id, res) => {
  const time = 60 * 60 * 24; // 24 hours in seconds
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: time,
  }); // sign a JWT token with the user ID and secret key

  res.cookie('jwt', token, { // Make sure the cookie name is 'jwt'
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + time * 1000), // set expiration time to the current time + 24 hours
    secure: process.env.NODE_ENV === 'PRODUCTION' ? true : false,
  }); // set the token as a cookie
};
