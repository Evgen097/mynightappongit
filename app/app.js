

angular.module('nightApp', ['ui.router', 'ngDialog', 'ngStorage', 'ngMap'])
    .constant("baseURL","http://localhost:8080/")
    

   .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'public/view/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'public/view/home.html',
                        controller  : 'MenuController'
                    },
                    'footer': {
                        templateUrl : 'public/view/footer.html'
                    }
                }
            })

            $urlRouterProvider.otherwise('/');
    })
    

                     
                     
                     
                     
                     
                     
                     
                     
    
    
    
    
    
    
    
    
    
    
