angular.module('TiaaMService', [])
    .factory('TiaaMongo', ['$http', function($http) {
        return {
            getAll: function() {
                return $http.get('/api/mongometrics');
            },

            // call to POST and create a new taxi
            create: function(tiaaData) {
                return $http.post('/api/mongometrics', tiaaData);
            },

            // call to DELETE a taxi
            delete: function(id) {
                return $http.delete('/api/mongometrics/' + id);
            },

            query: function(data, key, select) {
                return $http.get('/api/mongometrics/query/' + data + '/' + key + '/' + select);
            }
        }
}]);
