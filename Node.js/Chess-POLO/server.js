
//////////////////////
//initialize
//////////////////////
var fs = require('fs');
var express = require('express');
var app = express();
var ejs = require('ejs');

app.use(express.static('public'));

app.set('json spaces', 1);

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

//////////////////////
//Scan for routes
//////////////////////
fs.readdir('./routes/',function (err, files) {
  if (err) {
    throw new Error(err);
  }
    files.forEach(function (name) {//for every file found in /routes
        if(name.length>3 && //  check if it ends with .js
          name.charAt(name.length-3)=='.'  && 
          name.charAt(name.length-2)=='j' && 
          name.charAt(name.length-1)=='s'){

          var route = require('./routes/'+name);
        name=name.substring(0,name.length-3);
        console.log('adding route: '+name);
        if(name==='index'){
          app.get('/', route)
        }else{
          app.get('/'+name, route)
        }
      }
    });
  });

//////////////////////
//start server
//////////////////////
var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});

