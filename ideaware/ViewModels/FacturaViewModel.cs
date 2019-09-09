using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ideaware.ViewModels
{
    public class FacturaViewModel : IValidatableObject
    {
        [Required]
        public int? cliente { get; set; }
        public List<DetalleFacturaViewModel> productos { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (this.productos.Count==0)
            {                
                yield return new ValidationResult("Debe agregar por lo menos un producto");                
            }
        }
    }
}