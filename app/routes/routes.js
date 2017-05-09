// app/routes.js
const yelp = require('yelp-fusion');
const clientId = 'LhzcTXgPdDej6FnZ384Xtg';
const clientSecret = 'bFiRMgYZzOnJIOsbkcgMoWu9tIBYB6gVrHiLWdrjjtgYCdgonPSmpRmMCLmJrwoM';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Yelps = require('../models/yelps');



module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.sendFile(process.cwd() + '/public/index.html');
    });
    
    
    app.post('/confirm', function(req, res, next) {  
        
        
        Yelps.findOne({ 'name': req.body.name }, function (err, yelp) {
            if (err) res.send(null, 500);
            //console.log('yelp = '+ yelp) // Space Ghost is a talk show host.
          
            if(yelp==null){
                Yelps.create(req.body, function (err, yelp) {
                    if (err)  res.send(null, 500);
                    //console.log('Yelp created!');
                    var id = yelp._id;
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                res.end('Added the dish with id: ' + id);
               });
            }else{
                if (yelp.guests.indexOf(req.body.guests[0]) === -1) {
                    //console.log('yelp is not !'); 
                    yelp.guests.push( req.body.guests[0] ); // removed
                    yelp.guestsNames.push( req.body.guestsNames[0] );
                    
                } else {
                   //console.log('yelp already exists!');
                    yelp.guests.pull( req.body.guests[0] ); // removed
                    yelp.guestsNames.pull( req.body.guestsNames[0] );
                }
                
                yelp.save(function (err, resp) {
                    if (err) res.send(null, 500);
                    //console.log('yelp = '+ yelp);
                    res.json(resp);
                });
            }
        })
    })

    app.post('/yelp', function(req, res) {     
        var my_location = req.body.my_location;
        console.log('my_location = ' + my_location);
        
        const searchRequest = {
          //term:'Coffee',
          categories: "bars",
          location: my_location,
          limit: 10
        };
        
        yelp.accessToken(clientId, clientSecret).then(response => {
          const client = yelp.client(response.jsonBody.access_token);
          var result;
          var count = 0;
          var curent_bar;
          
          function update_from_db (bar){
                      //console.log('bars[key] = ' + bars.id);
                      Yelps.findOne({ 'name': bar.id }, function (err, yelp) {
                        if (err) res.send(null, 500);
                        //console.log('updated yelp = ' + yelp);
                        count++;
                        if(yelp != null){
                            bar.guests = yelp.guests;
                            bar.guestsNames = yelp.guestsNames;
                        }
                        if(count == result.length){
                            //console.log('updated yelp = ' + yelp);
                            
                            
                            res.json(result);
                        }
                   });
          }
          
          
          function get_reviews (bar){
                client.reviews(bar.id).then(response => {
                    count++;
                    curent_bar = bar;
                    curent_bar.review = response.jsonBody.reviews[0].text;
                    //console.log('curent_bar = ' + curent_bar.id);
                    
                    if(count == result.length){
                        count = 0;
                        for (var key in result){
                            update_from_db (result[key]);
                        }
                        //res.json(result);
                    }
                    }).catch(e => {
                      console.log(e);
                    });
          }
          client.search(searchRequest).then(response => {
              console.log('response = '+response);
            result = response.jsonBody.businesses;
      
            //console.log('response coordinates = '+result[0].coordinates.latitude); 
            //console.log('response coordinates = '+result[0].coordinates.longitude);
            for (var key in result){
                //console.log('result[key] =  ' + key + '  ==  ' + result[0][key]);
                    //console.log('response coordinates = '+result[key].coordinates.latitude); 
                    //console.log('response coordinates = '+result[key].coordinates.longitude);
                for(var i in result[key]){
                    //console.log('result[key][i] =  ' + i + '  ==  ' + result[key][i]);
                    //console.log('result.coordinates  = '+ result[key][i] );
                }
            }
            
            
            const prettyJson = JSON.stringify(result, null, 4);
            for (var key in result){
                get_reviews(result[key]);
            }
          });
        }).catch(e => {
            console.log('eror= ');
          console.log(e);
        });
    });
    
    
    



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        console.log('req.user = ' + req.user);
        var obj = {'user' : req.user};
        res.send(obj);
        
        //res.render('profile.ejs', {
        //    user : req.user // get the user out of session and pass to template
        //});
    });
    

    // =====================================
    // TWITTER ROUTES ======================
    // =====================================
    // route for twitter authentication and login
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );
        
    




    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}