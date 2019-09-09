angular.module("api.clientes", ["clientes.services",'angularUtils.directives.dirPagination'])
    .controller("listado", ["$scope", 'clienteService', function ($scope,client) {
        var vm = this;
        $('body').attr('class', 'charging');
        client.GetData()
            .then(function (data) {
                vm.clientes = data.clientes;
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
                                    text: "Cliente eliminado exitosamente",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    closeOnConfirm: true
                                },
                                    function () {
                                        window.location.href = "/clientes";
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
    .controller("crear", ["$scope", 'clienteService', function ($scope, client) {
        var clientevm = this;
        clientevm.cliente = {};

        $scope.$watch('id', function () {
            if ($scope.id != null) {
                $('body').attr('class', 'charging');
                client.GetCliente($scope.id)
                    .then(function (data) {
                        clientevm.cliente = data;
                        $('body').attr('class', '');
                    })
                    .catch(function () {
                        $('body').attr('class', '');
                        swal("Error", "Error cargando recarga la pagina", "error");
                    })
            }
        });

        clientevm.guardar = function guardar() {

            if (!clientevm.clienteform.$valid) {
                swal("Error", "Solucione los errores del formulario");
                return;
            }

            $('body').attr('class', 'charging');
            clientevm.errores = null;
            client.SaveCliente(clientevm.cliente)
                .then(function (data) {
                    $('body').attr('class', '');
                    if (!data.success) {
                        clientevm.errores = data.errores;
                        return;
                    }
                    swal({
                        title: "Realizado",
                        text: "Usuario guardado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                        },
                            function () {
                                window.location.href = "/clientes";
                            }
                        );
                    
                })
                .catch(function () {
                    $('body').attr('class', '');
                    swal("Error", "Error guardar recarga la pagina", "error");
                })
        }
       
    }]);