function log(req, res, next) {
  console.log('Lodding...');
  next();
}

module.exports = log;