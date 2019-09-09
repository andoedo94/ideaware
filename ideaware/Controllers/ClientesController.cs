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
    [Authorize(Roles ="Clientes, Administrador")]
    public class ClientesController : Controller
    {
        private IdeawareEntities access = new IdeawareEntities();
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        // GET: Clientes
        public ActionResult Index()
        {           
            return View();
        }

        public ActionResult Crear(int ? id)
        {
            ViewBag.id = id;
            return View();
        }

        [HttpPost]
        public string Delete(int id)
        {
            var cliente = this.access.clientes.Find(id);
            if (cliente.facturas.Count > 0)
            {
                return this.serializer.Serialize(new { success = false, error = "Existen facturas asociadas a este cliente" });
            }
            access.clientes.Remove(cliente);
            access.SaveChanges();
            return this.serializer.Serialize(new { success = true });
        }

        [HttpGet]
        public string Cliente(int id) {
            var cliente = access.clientes.Where(client=>client.id == id).Select(client => new {
                                                                                                id=client.id,
                                                                                                nombre=client.nombre,
                                                                                                apellido=client.apellidos,
                                                                                                identificacion=client.identificacion
                                                                                                }).FirstOrDefault();
            return serializer.Serialize(cliente);
        }

        [HttpGet]
        public string Listado()
        {
            var clientes = access.clientes.Select(client => new{ client.id,
                                                                 client.nombre,
                                                                 client.apellidos,
                                                                 client.identificacion
                                                                });
            return serializer.Serialize(new { clientes = clientes});
        }

        [HttpPost]
        public string Save(ClienteViewModel cliente) {

            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> errores = ModelState.Values.SelectMany(v => v.Errors);
                return serializer.Serialize(new { success=false,errores= errores });
            }

            cliente client;
            if (cliente.id is null) {
                client = new cliente();
            }
            else
            {
                client = access.clientes.Find(cliente.id);
            }


            client.nombre = cliente.nombre;
            client.apellidos = cliente.apellido;
            client.identificacion = cliente.identificacion.Value;

            if(cliente.id is null)
            {
                access.clientes.Add(client);
            }

            access.SaveChanges();
            return serializer.Serialize(new { success = true});
        }
    }
}