angular.module("empleados.services", [])
    .factory("empleadoService", ["$http", "$q", function ($http, $q) {

        return {

        Delete: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/empleados/delete', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetData: function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/empleados/listado').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetRoles: function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/empleados/roles').success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        SaveEmpleado: function (data) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.post('/empleados/save', data).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },

        GetEmpleado: function (id) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/empleados/empleado/'+id).success(function (data) {
                defered.resolve(data);
            }).error(function (err) {
                defered.reject(err);
            })
            return promise;
        },
    }
}]);