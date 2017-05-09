// note_routes.js
var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, passport) {
  


  app.get('/', (req, res) => {
     res.sendFile(process.cwd() + '/public/index.html');
  });
  

  
};