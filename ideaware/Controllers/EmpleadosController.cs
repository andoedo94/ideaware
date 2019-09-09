using ideaware.Models;
using ideaware.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace ideaware.Controllers
{
    [Authorize(Roles ="Administrador")]
    public class EmpleadosController : Controller
    {
        private IdeawareEntities access = new IdeawareEntities();
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        private ApplicationUserManager _userManager;
        public EmpleadosController()
        {
        }

        public EmpleadosController(ApplicationUserManager userManager)
        {
            UserManager = userManager;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        // GET: Empleados
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string Delete(string id)
        {
            var empleado = this.access.empleados.Find(id);
            AspNetUser user = empleado.AspNetUser;
            access.empleados.Remove(empleado);
            access.AspNetUsers.Remove(user);
            access.SaveChanges();
            return this.serializer.Serialize(new { success = true });
        }

        [HttpGet]
        public string Empleado(string id)
        {
            var cliente = access.empleados.Where(client => client.id == id).Select(client => new {
                id = client.id,
                nombre = client.nombre,
                apellido = client.apellidos,
                username = client.AspNetUser.UserName,
                roles = client.AspNetUser.AspNetRoles.Select(x => x.Id).ToList()
            }).FirstOrDefault();
            return serializer.Serialize(cliente);
        }

        public ActionResult Crear(string id)
        {
            ViewBag.id = id;
            return View();
        }

        [HttpGet]
        public string Listado()
        {
            string id=User.Identity.GetUserId();
            var empleados = access.empleados.Where(emp=> emp.id != id).Select(employee => new {
                employee.id,
                employee.nombre,
                username=employee.AspNetUser.UserName,
                employee.apellidos,
                roles=employee.AspNetUser.AspNetRoles.Select(x=>x.Name).ToList()
            });
            return serializer.Serialize(new { empleados = empleados });
        }

        [HttpGet]
        public string Roles()
        {
            var roles = access.AspNetRoles.Select(rol => new {
                id=rol.Id,
                nombre=rol.Name
            });
            return serializer.Serialize(new { roles = roles });
        }

        [HttpPost]
        public string Save(EmpleadoViewModel empleado)
        {

            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> errores = ModelState.Values.SelectMany(v => v.Errors);
                return serializer.Serialize(new { success = false, errores = errores });
            }

            empleado employee;
            if (empleado.id is null)
            {
                var user = new ApplicationUser { UserName = empleado.username, Email = empleado.username };
                var result = UserManager.Create(user, empleado.password);
                if (result.Succeeded)
                {
                    employee = new empleado()
                    {
                        id = user.Id,
                        nombre = empleado.nombre,
                        apellidos = empleado.apellido
                    };

                    AspNetUser apspnet = access.AspNetUsers.Find(user.Id);
                    foreach(string rol in empleado.roles)
                    {
                        var role = access.AspNetRoles.Find(rol);
                        apspnet.AspNetRoles.Add(role);
                    }
                    
                    this.access.empleados.Add(employee);
                    this.access.SaveChanges();
                    return serializer.Serialize(new { success = true });
                }
                return serializer.Serialize(new { success = false });
            }           
            
            employee=this.access.empleados.Find(empleado.id);
            employee.AspNetUser.AspNetRoles.Clear();
            foreach (string rol in empleado.roles)
            {
                var role = access.AspNetRoles.Find(rol);
                employee.AspNetUser.AspNetRoles.Add(role);
            }

            employee.nombre = empleado.nombre;
            employee.apellidos = empleado.apellido;
            employee.AspNetUser.UserName = empleado.username;
            this.access.SaveChanges();
            return serializer.Serialize(new { success = true });
        }
    }
}