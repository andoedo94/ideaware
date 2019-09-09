angular.module("api.empleados", ["empleados.services", 'angularUtils.directives.dirPagination','ui.select'])
    .controller("listado", ["$scope", 'empleadoService', function ($scope,client) {
        var vm = this;
        $('body').attr('class', 'charging');
        client.GetData()
            .then(function (data) {                
                vm.empleados = data.empleados;
                $('body').attr('class', '');
            })
            .catch(function () {
                $('body').attr('class', '');
                swal("Error", "Error al traer los datos recarga la pagina", "error");
            });

        vm.delete = function (id) {
            swal({
                title: "¿Desea eliminar?",
                text: "No se podra recuperar",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-warning",
                confirmButtonText: "Ok",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            },
                function () {

                    client.Delete({ id: id })
                        .then(function (data) {

                            if (data.success) {
                                swal({
                                    title: "Realizado",
                                    text: "Empleado eliminado exitosamente",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    closeOnConfirm: true
                                },
                                    function () {
                                        window.location.href = "/empleados";
                                    }
                                );
                            }
                            else {
                                swal("Error", data.error, "error");
                            }

                        })
                        .catch(function () {
                            swal("Error", "Error al traer los datos recarga la pagina", "error");
                        })
                }
            );
        };
    }])
    .controller("crear", ["$scope", 'empleadoService', function ($scope, client) {
        var empleadovm = this;
        empleadovm.empleado = {};
        empleadovm.editar = false;

        $('body').attr('class', 'charging');
        client.GetRoles()
            .then(function (data) {                
                empleadovm.roles = data.roles;
                $('body').attr('class', '');
            })
            .catch(function () {
                $('body').attr('class', '');
                swal("Error", "Error al traer los datos recarga la pagina", "error");
            });

        $scope.$watch('id', function () {
            if ($scope.id != null) {
                $('body').attr('class', 'charging');
                client.GetEmpleado($scope.id)
                    .then(function (data) {
                        empleadovm.editar = true;
                        empleadovm.empleado = data;
                        $('body').attr('class', '');
                    })
                    .catch(function () {
                        $('body').attr('class', '');
                        swal("Error", "Error cargando recarga la pagina", "error");
                    })
            }
        });

        empleadovm.guardar = function guardar() {

            if (!empleadovm.empleadoform.$valid) {
                swal("Error", "Solucione los errores del formulario");
                return;
            }

            $('body').attr('class', 'charging');
            empleadovm.errores = null;
            client.SaveEmpleado(empleadovm.empleado)
                .then(function (data) {
                    $('body').attr('class', '');
                    if (!data.success) {
                        empleadovm.errores = data.errores;
                        return;
                    }
                    swal({
                        title: "Realizado",
                        text: "Empleado guardado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                        },
                            function () {
                                window.location.href = "/empleados";
                            }
                        );
                    
                })
                .catch(function () {
                    $('body').attr('class', '');
                    swal("Error", "Error guardar recarga la pagina", "error");
                })
        }
       
    }]);