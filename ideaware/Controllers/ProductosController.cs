using ideaware.Models;
using ideaware.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ideaware.Controllers
{
    [Authorize(Roles = "Facturas, Administrador")]
    public class ProductosController : Controller
    {
        private IdeawareEntities access = new IdeawareEntities();
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        // GET: Productos
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Crear(int? id)
        {
            ViewBag.id = id;
            return View();
        }

        [HttpGet]
        public string Producto(int id)
        {
            var producto = this.access.productos.Where(product => product.id == id).Select(product => new {
                id = product.id,
                nombre = product.nombre,
                valor = product.valor              
            }).FirstOrDefault();
            return serializer.Serialize(producto);
        }

        [HttpGet]
        public string Listado()
        {
            var productos = this.access.productos.Select(producto => new {
                producto.id,
                producto.nombre,
                producto.valor                
            });
            return this.serializer.Serialize(new { productos = productos });
        }

        [HttpPost]
        public string Delete(int id)
        {
            var productos = this.access.productos.Find(id);
            if (productos.productos_factura.Count > 0)
            {
                return this.serializer.Serialize(new { success = false, error="Existen facturas asociadas a este producto" });
            }
            access.productos.Remove(productos);
            access.SaveChanges();
            return this.serializer.Serialize(new { success = true});
        }

        [HttpPost]
        public string Save(ProductoViewModel producto)
        {

            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> errores = ModelState.Values.SelectMany(v => v.Errors);
                return this.serializer.Serialize(new { success = false, errores = errores });
            }

            producto product;
            if (producto.id is null)
            {
                product = new producto();
            }
            else
            {
                product = this.access.productos.Find(producto.id);
            }


            product.nombre = producto.nombre;
            product.valor = producto.valor.Value; 

            if (producto.id is null)
            {
                this.access.productos.Add(product);
            }

            this.access.SaveChanges();
            return this.serializer.Serialize(new { success = true });
        }

    }
}