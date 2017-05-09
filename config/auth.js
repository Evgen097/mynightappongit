// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '216690122153585', // your App ID
        'clientSecret'  : '9b7440a6c4de1bdc6da6bf0b1248e1d1', // your App Secret
        'callbackURL'   : 'https://mynightapp-evgenkaban.c9users.io/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'zpsuyFSIixsP3vIxNrT0HV5g5',
        'consumerSecret'    : 'PROA6yVJIny715olyLuXTQzlNpiAJzmISSTMhieRnl8WDNj7u2',
        'callbackURL'       : 'https://mynigthapp.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};