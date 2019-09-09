angular.module("facturas.services", [])
    .factory("facturaService", ["$http", "$q", function ($http, $q) {

    return {

        GetData: function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/facturas/listado').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        SaveFactura: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/facturas/save', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetInfo: function (id) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/facturas/datos').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },
    }
}]);