// import Express framework
const express = require('express');
// import routes module
const routes = require('./routes');
// import sequelize connection
const sequelize = require('./config/connection')

// create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// parse incoming JSON data
app.use(express.json());
// parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use(routes);

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  // star the server and listen on the specifide port
  app.listen(PORT, () => {
    // display message indicating that the server is running
    console.log(`App listening on port ${PORT}!`);
  });
});
