angular.module("api.facturas", ["facturas.services",'angularUtils.directives.dirPagination'])
    .controller("listado", ["$scope", 'facturaService', function ($scope,client) {
        var vm = this;
        $('body').attr('class', 'charging');
        client.GetData()
            .then(function (data) {
                vm.facturas = data.facturas;
                $('body').attr('class', '');
            })
            .catch(function () {
                $('body').attr('class', '');
                swal("Error", "Error al traer los datos recarga la pagina", "error");
            });
    }])
    .controller("crear", ["$scope", 'facturaService', function ($scope, client) {
        var facturavm = this;
        facturavm.factura = {};   
        facturavm.producto = {};
        facturavm.factura.productos = []; 
        facturavm.productos = [];
        facturavm.total = 0;


        client.GetInfo()
            .then(function (data) {
                facturavm.productos = data.productos;
                facturavm.clientes = data.clientes;
            })
            .catch(function () {
                $('body').attr('class', '');
                swal("Error", "Error al cargar recarga la pagina", "error");
            })
        facturavm.precio = function () {
            if (facturavm.producto.id == null || facturavm.producto.id == "" || facturavm.producto.cantidad == null || facturavm.producto.cantidad == "") {
                
                return;
            }
            var indice = buscar(facturavm.productos, 'id', parseInt(facturavm.producto.id));
            facturavm.producto.valor = facturavm.productos[indice].valor;

        }
        facturavm.agregar = function () {
            if (facturavm.producto.id == null || facturavm.producto.id == "" || facturavm.producto.cantidad == null || facturavm.producto.cantidad == "") {
                swal("Error", "Debe agregar la cantidad y escoger el producto", "error");
                return;
            }
            var indice = buscar(facturavm.productos, 'id', parseInt(facturavm.producto.id));
            facturavm.factura.productos.push({
                id: facturavm.producto.id,
                nombre: facturavm.productos[indice].nombre,
                cantidad: facturavm.producto.cantidad,
                valor: facturavm.producto.valor * facturavm.producto.cantidad
            });
            facturavm.total += facturavm.producto.valor * facturavm.producto.cantidad;
            facturavm.producto = {};
        };
        
        facturavm.guardar = function guardar() {

            if (!facturavm.facturaform.$valid) {
                swal("Error", "Solucione los errores del formulario");
                return;
            }

            if (facturavm.factura.productos.length == 0) {
                swal("Error", "Debe ingresar por lo menos un articulo");
                return;
            }

            $('body').attr('class', 'charging');
            facturavm.errores = null;
            client.SaveFactura(facturavm.factura)
                .then(function (data) {
                    $('body').attr('class', '');
                    if (!data.success) {
                        facturavm.errores = data.errores;
                        return;
                    }
                    swal({
                        title: "Realizado",
                        text: "Factura guardada exitosamente",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonClass: "btn-success",
                        confirmButtonText: "Ok",
                        closeOnConfirm: true
                        },
                            function () {
                                window.location.href = "/facturas";
                            }
                        );
                    
                })
                .catch(function () {
                    $('body').attr('class', '');
                    swal("Error", "Error guardar recarga la pagina", "error");
                })
        }

        function buscar(array,campo,valor) {
            for (var j = 0; j < array.length; j++) {
                if (array[j][campo] == valor) {
                    return j;
                }
            }
            return -1;
        }

       
    }]);