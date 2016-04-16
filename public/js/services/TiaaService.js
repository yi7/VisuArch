angular.module('TiaaService', [])
    .factory('Tiaa', ['$http', function($http) {
        return {
            mongoGetAll: function() {
                return $http.get('/api/mongometrics');
            },
            mongoCreate: function(tiaaData) {
                return $http.post('/api/mongometrics', tiaaData);
            },
            mongoDelete: function(id) {
                return $http.delete('/api/mongometrics/' + id);
            },
            mongoQuery: function(type, key) {
                return $http.get('/api/mongometrics/query/' + type + '/' + key);
            },

            firebaseGetAll: function() {
                return $http.get('/api/firebasemetrics');
            },
            firebaseCreate: function(tiaaData) {
                return $http.post('/api/firebasemetrics', tiaaData);
            },
            firebaseDelete: function(id) {
                return $http.delete('/api/firebasemetrics/' + id);
            },
            firebaseQuery: function(type, key) {
                return $http.get('/api/firebasemetrics/query/' + type + '/' + key);
            },

            couchGetAll: function() {
                return $http.get('/api/couchmetrics');
            },
            couchCreate: function(tiaaData) {
                return $http.post('/api/couchmetrics', tiaaData);
            },
            couchDelete: function(id, rev) {
                return $http.delete('/api/couchmetrics/' + id + '/' + rev);
            },
            couchQuery: function(type, key) {
                return $http.get('/api/couchmetrics/query/' + type + '/' + key);
            }
        }
}]);
