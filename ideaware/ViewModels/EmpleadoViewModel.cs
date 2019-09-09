using ideaware.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ideaware.ViewModels
{
    public class EmpleadoViewModel : IValidatableObject
    {
        public string id { get; set; }

        [Required]
        public string nombre { get; set; }
        [Required]
        public string apellido { get; set; }

        [Required]
        public string username { get; set; } 
        
        [MinLength(6)]
        public string password { get; set; }

        [MinLength(6)]        
        public string confirmarpassword { get; set; }

        [Required]
        public string[] roles { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            IdeawareEntities access = new IdeawareEntities();

           
            if (this.id is null)
            {
                if(this.password == null || this.confirmarpassword == null)
                {
                    yield return new ValidationResult("Cuando se crea el password es requerido");
                }

                if (!this.password.Equals(this.confirmarpassword))
                {
                    yield return new ValidationResult("Los passwords deben coincidir");
                }

                var empleados = access.AspNetUsers.Where(empleado => empleado.UserName == this.username).ToList();
                if (empleados.Count > 0)
                {
                    yield return new ValidationResult("Username ya existe");
                }
            }
            else
            {
                var empleados = access.AspNetUsers.Where(empleado => empleado.UserName == this.username && empleado.Id != id).ToList();
                if (empleados.Count > 0)
                {
                    yield return new ValidationResult("Username ya existe");
                }
            }
        }
    }
}