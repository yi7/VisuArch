angular.module('TaxiFService', [])

    .factory('TaxiFire', ['$http', function($http) {

        return {
            getAll : function() {
                return $http.get('/api/firetaxis');
            },

            // call to POST and create a new taxi
            create : function(taxiData) {
                return $http.post('/api/firetaxis', taxiData);
            },

            // call to DELETE a taxi
            delete : function(id) {
                return $http.delete('/api/firetaxis/' + id);
            },

            query: function(key) {
                return $http.get('/api/mongotaxis/query/' + key);
            }
        }
}]);
