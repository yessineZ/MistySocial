import jwt from 'jsonwebtoken';

<<<<<<< HEAD
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
=======
export const generateTokenAndSetCookie = (id,res) => {
   const time =  60 * 60 * 24; 
    const token = jwt.sign({ id }, 
        process.env.SECRET,
         { expiresIn: time ,
        }) ;  // sign a JWT token with the user ID and secret key
    
    res.cookie('jwt', token, { 
        httpOnly: true, 
        sameSite: 'strict',
        expires: new Date(Date.now() + time * 1000),  // set expiration time to the current time + 24 hours
        secure : process.env.NODE_ENV === 'PRODUCTION' ? true : false
    });  // set the token as a cookie
    




}
>>>>>>> bec1ce80605259295190d5a815e6df47e90d9a57
