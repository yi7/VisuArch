angular.module('TaxiMService', [])

    .factory('TaxiMongo', ['$http', function($http) {

        return {
            getAll : function() {
                return $http.get('/api/mongotaxis');
            },

            // call to POST and create a new taxi
            create : function(taxiData) {
                return $http.post('/api/mongotaxis', taxiData);
            },

            // call to DELETE a taxi
            delete : function(id) {
                return $http.delete('/api/mongotaxis/' + id);
            }
        }
}]);
