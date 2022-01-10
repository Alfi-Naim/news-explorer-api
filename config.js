const { NODE_ENV, JWT_SECRET, DB_ADDRESS } = process.env;

const devJwt = 'super-strong-secret';
const devDbAddress = 'mongodb://localhost:27017/newsDbDev';

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  DB_ADDRESS,
  devJwt,
  devDbAddress,
};
