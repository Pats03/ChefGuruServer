const {verifyJWT} = require('../utils/tokenUtils.js');

const authenticateUser = async (req, res, next) => {
  console.log(req.cookies);
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send({ message: 'unauthenticated user' });
  }

  const { userId } = verifyJWT(token);

  req.user = { userId };

  next();
};
module.exports = authenticateUser;
