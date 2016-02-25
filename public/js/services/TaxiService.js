// public/js/services/TaxiService.js

angular.module('TaxiService', [])

    .factory('Taxi', ['$http', function($http) {

        return {
            getAll : function(callback) {
                return $http.get('/api/taxis');
            },

            // call to POST and create a new taxi
            create : function(taxiData) {
                return $http.post('/api/taxis', taxiData);
            },

            // call to DELETE a taxi
            delete : function(id) {
                return $http.delete('/api/taxis/' + id);
            }
        }
}]);
