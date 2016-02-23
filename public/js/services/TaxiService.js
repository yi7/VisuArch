// public/js/services/TaxiService.js

angular.module('TaxiService', [])

    .factory('Taxi', ['$http', function($http) {

        return {
            // call to get all taxis
            getAll : function(callback) {
                /*return $http.get('/api/taxis').then( function(response) {
                    console.log(callback);
                    return response.data;
                    //if(callback) {
                        //console.log(response.data);
                    //}
                }).catch(function(error) {
                    console.log(error);
                });*/
                return $http.get('/api/taxis');
            },

            // call to POST and create a new taxi
            create : function(taxiData) {
                return $http.post('/api/taxis', taxiData);
            },

            // call to DELETE a nerd
            delete : function(id) {
                return $http.delete('/api/taxis/' + id);
            }
        }
}]);
