angular.module('nightApp')

    .service('menuFactory', ['$http', 'baseURL', function($http,baseURL) {
        this.getYelpCaffe = function(){
            return $http.get('/yelp');
        };

    }])
    
    .service('headerFactory', ['$http', 'baseURL', function($http,baseURL) {

        this.getUser = function(){
            return $http.get('/profile');
        };
        
        

    }])
    
   

