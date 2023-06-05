// import express router
const router = require('express').Router();

// import api routes
const apiRoutes = require('./api');

// use apiRoutes when path starts with '/api'
router.use('/api', apiRoutes);

// middleware to handle request that doesn't match a defined route
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

// export the router module
module.exports = router;