angular.module("api.productos", ["productos.services",'angularUtils.directives.dirPagination'])
    .controller("listado", ["$scope", 'productoService', function ($scope,client) {
        var vm = this;
        $('body').attr('class', 'charging');
        client.GetData()
            .then(function (data) {
                vm.productos = data.productos;
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
                                    text: "Producto eliminado exitosamente",
                                    type: "success",
                                    showCancelButton: false,
                                    confirmButtonClass: "btn-success",
                                    confirmButtonText: "Ok",
                                    closeOnConfirm: true
                                },
                                    function () {
                                        window.location.href = "/productos";
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
    .controller("crear", ["$scope", 'productoService', function ($scope, client) {
        var productovm = this;
        productovm.producto = {};

        $scope.$watch('id', function () {
            if ($scope.id != null) {
                $('body').attr('class', 'charging');
                client.GetProducto($scope.id)
                    .then(function (data) {
                        productovm.producto = data;
                        $('body').attr('class', '');
                    })
                    .catch(function () {
                        $('body').attr('class', '');
                        swal("Error", "Error cargando recarga la pagina", "error");
                    })
            }
        });

        productovm.guardar = function guardar() {

            if (!productovm.productoform.$valid) {
                swal("Error", "Solucione los errores del formulario");
                return;
            }

            $('body').attr('class', 'charging');
            productovm.errores = null;
            client.SaveProducto(productovm.producto)
                .then(function (data) {
                    $('body').attr('class', '');
                    if (!data.success) {
                        productovm.errores = data.errores;
                        return;
                    }
                    swal({
                        title: "Realizado",
                        text: "Producto guardado exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                        },
                            function () {
                                window.location.href = "/productos";
                            }
                        );
                    
                })
                .catch(function () {
                    $('body').attr('class', '');
                    swal("Error", "Error guardar recarga la pagina", "error");
                })
        }
       
    }]);