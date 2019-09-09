using ideaware.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ideaware.ViewModels
{
    public class ProductoViewModel 
    {       
        public int? id { get; set; }
        [Required]
        public string nombre { get; set; }
        [Required]
        public float? valor { get; set; }
    }
}