using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ideaware.ViewModels
{
    public class DetalleFacturaViewModel
    {
        [Required]
        public int? id { get; set; }
        [Required]
        public int? cantidad { get; set; }

        [Required]
        public float? valor { get; set; }
    }
}