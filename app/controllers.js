
angular.module('nightApp')

    .controller('MenuController', ['$scope', '$timeout', '$http', 'menuFactory', '$localStorage', '$sessionStorage', 'NgMap', function($scope, $timeout, $http, menuFactory, $localStorage, $sessionStorage, NgMap) {
        /* 
            You're ready to start developing with Google Maps JavaScript API
            YOUR API KEY
            AIzaSyCzJwXuJsdfDIYuP2wo6yJ5eQtxlIepbFQ
        */
        
        $scope.yelpMap = function( location_arr ){
        
              NgMap.getMap().then(function(map) {
                $scope.map = map;
              });
              $scope.stores1 = {
                shop: { position:[41, -87], bar_name: 'name', city: 'London'},
                bar:{ position:[41, -83], bar_name: 'name2', city: 'London'},
                car:{ position:[42, -85], bar_name: 'name3', city: 'Paris'}
              };
              $scope.showStore = function(evt, storeId) {
                $scope.store = $scope.stores[storeId];
                $scope.map.showInfoWindow('foo', this);
              };
              $scope.mouseover = function() {
                console.log('mouseover');
              };
        }



        $scope.showMessage = false;
        $scope.showBars = false;
        $scope.message = "Loading ...";
        $scope.alertSuccess = false;
        $scope.alertDanger= false;

         $scope.yelpCaffe = function(my_location){
            $scope.showMessage = true;
            $scope.showBars = false;
            $http.defaults.headers.post["Content-Type"] = "application/json";
            var obj ={"my_location": my_location};
            if(!$localStorage.tempLocation){ $localStorage.$default({'tempLocation': my_location});}
            $localStorage.tempLocation = my_location;
            //console.log('$localStorage.$default  = '+ $localStorage.tempLocation );
            $http({
                url: '/yelp',
                method: "POST",
                data: obj
            })
               .then(
                    function(response) {
                        console.log('response.data = '+ response.data);
                        $scope.bars = response.data;
                        $scope.message = "Loading ...";
                        $scope.stores = {};
                        $scope.center = false;
                        for (var key in $scope.bars){
                            $scope.bars[key].my_confirm = false;
                            $scope.bars[key].my_confirm_going= false;
                            $scope.bars[key].my_confirm_uploading= false;
                            //var name = $scope.bars[key].name;
                            $scope.stores[$scope.bars[key].name] = {position:[$scope.bars[key].coordinates.latitude, $scope.bars[key].coordinates.longitude], bar_name: $scope.bars[key].name, city: my_location}
                            if(!$scope.center){$scope.center = {'lat': $scope.bars[key].coordinates.latitude, 'lon': $scope.bars[key].coordinates.longitude}}
                            
                            if($scope.bars[key].guestsNames){
                                var found = $scope.bars[key].guestsNames.includes($localStorage.username);
                                console.log('found = '+ found);
                                if (found){
                                    $scope.bars[key].my_confirm_going= true;
                                }
                            }
 
                            
                            
                            
                            
                            //console.log('bars_locations[name].position = '+ $scope.bars_locations[$scope.bars[key].name].bar_name);

                             
                             
                            //$scope.bars_locations[name] = {position:[$scope.bars[key].coordinates.latitude, $scope.bars[key].coordinates.longitude], bar_name: $scope.bars[key].name, city: my_location}
                            //console.log('$scope.bars_locations.$scope.bars[key].name = '+ $scope.bars[key].name); 
                            //console.log('$scope.bars_locations.$scope.bars[key].name = '+ $scope.bars_locations.$scope.bars[key].name); 
                            //console.log('response coordinates = '+ $scope.bars[key].coordinates.latitude); 
                            //console.log('response coordinates = '+ $scope.bars[key].coordinates.longitude);
                            //$scope.bars[key].loc_coordinates = {'lat': $scope.bars[key].coordinates.latitude, 'lon': $scope.bars[key].coordinates.longitude};
                             
                            if ($scope.bars[key].guests == undefined){
                                 $scope.bars[key].number_of_guests = 0;
                            }else{ 
                                $scope.bars[key].number_of_guests = $scope.bars[key].guests.length
                            }
                        }
                        $scope.yelpMap();
                        $scope.showMessage = false;
                        $scope.showBars = true;
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );
        }
        //console.log('$localStorage.tempLocation  = '+ $localStorage.tempLocation );
        if($localStorage.tempLocation){$scope.yelpCaffe($localStorage.tempLocation);}

        
        $scope.confirm_my_going = function(){
            //console.log(this.bar);

            if (this.bar.guestsNames == undefined){this.bar.guestsNames = []};
            var found = this.bar.guestsNames.includes($localStorage.username);
            var this_bar = this;
            this.bar.my_confirm_uploading= true;
            
            if (found){
                //this.bar.my_confirm_going = false;
                this.bar.number_of_guests--; 
                this.bar.guestsNames.splice(this.bar.guestsNames.indexOf($localStorage.username), 1);
      
            }else{
                this.bar.my_confirm_going = true;
                this.bar.number_of_guests++; 
                this.bar.guestsNames.push($localStorage.username);
            }
            
            if (!$localStorage.twitter_id){alert("First loggin!"); return}

            $http.defaults.headers.post["Content-Type"] = "application/json";
            
            var obj ={"name": this.bar.id, "going": 1, "guests": [$localStorage.twitter_id], "guestsNames": [$localStorage.username] };
            
            $http({
                url: '/confirm',
                method: "POST",
                data: obj
            })
               .then(
                    function(response) {
                        //console.log('successfulli upload on server = ' + response.data);
                        if (found){
                                this_bar.bar.my_confirm_going = false;
                            }
    
                        this_bar.bar.my_confirm_uploading = false;
                        
                        //$scope.alertSuccess = true;
                        var countUp = function() {
                            $scope.alertSuccess = false;
                        }
                        //$timeout(countUp, 1500);
                        
                        
                        //$scope.bars = response.data;
                        //$scope.showConfirmMessage = false;
                        //$scope.showBars = true;
                        //$scope.myConfirm = true;
                        //$scope.yelpCaffe($scope.tempLocation);
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                        //console.log('successfulli upload on server = ' + $scope.message);
                        $scope.alertDanger = true;
                        var countUp = function() {
                            $scope.alertDanger = false;
                        }
                        $timeout(countUp, 1500);
                    }
            );
        }
        
        
        
        
        
        
        

    }])
    

    .controller('HeaderController', ['$scope', 'headerFactory', '$state', '$rootScope', '$localStorage', '$sessionStorage',    function ($scope, headerFactory, $state,  $rootScope, $localStorage, $sessionStorage) {

        if(!$localStorage.username){
            $scope.loggedIn = false;
        }else{$scope.loggedIn = true; $scope.username = $localStorage.username;}
        
        
        $scope.login = 
            headerFactory.getUser()
                .then(
                    function(response) {
                        if (response.data.user){
                            $scope.loggedIn = true;
                            $localStorage.$default({'username': response.data.user.twitter.username, 'twitter_id':response.data.user.twitter.id});
                            $scope.username = $localStorage.username;
                            //$scope.userTwitterId = $localStorage.twitter_id;
                            //console.log('response.data.user.twitter.id = ' + response.data.user.twitter.id );
                            //console.log('response.data.user.twitter.username = ' + response.data.user.twitter.username)
                            //console.log('response.data.user.twitter.token = ' + response.data.user.twitter.token)
                        };
                    },
                    function(response) {
                        $scope.message = "Error: "+response.status + " " + response.statusText;
                    }
            );
            
        
    
         $scope.logout = function () {
            $scope.loggedIn = false;
            //console.log('Doing logout');
            delete $localStorage.username;
            delete $localStorage.twitter_id;
         };
      

    



    
}])



;