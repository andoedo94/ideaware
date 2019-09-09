using ideaware.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ideaware.ViewModels
{
    public class ClienteViewModel : IValidatableObject
    {       
        public int? id { get; set; }
        [Required]
        public string nombre { get; set; }
        [Required]
        public string apellido { get; set; }
        [Required]
        public long? identificacion { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            IdeawareEntities access = new IdeawareEntities();
           
            if (this.id is null)
            {
                var clientes = access.clientes.Where(cliente => cliente.identificacion == this.identificacion).ToList();
                if (clientes.Count > 0)
                {
                    yield return new ValidationResult("Identificacion ya existe");
                }
            }
            else
            {
                var clientes = access.clientes.Where(cliente => cliente.identificacion == this.identificacion && cliente.id != id).ToList();
                if (clientes.Count > 0)
                {
                    yield return new ValidationResult("Identificacion ya existe");
                }
            }
        }
    }
}