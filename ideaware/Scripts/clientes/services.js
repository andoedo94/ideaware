angular.module("clientes.services", [])
.factory("clienteService", ["$http", "$q", function ($http, $q) {

    return {
        Delete: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/clientes/delete', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetData: function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/clientes/listado').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        SaveCliente: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/clientes/save', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetCliente: function (id) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/clientes/cliente/'+id).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },
    }
}]);