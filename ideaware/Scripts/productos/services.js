angular.module("productos.services", [])
    .factory("productoService", ["$http", "$q", function ($http, $q) {

        return {

        Delete: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/productos/delete',data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
            },

        GetData: function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/productos/listado').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        SaveProducto: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/productos/save', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetProducto: function (id) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/productos/producto/'+id).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },
    }
}]);