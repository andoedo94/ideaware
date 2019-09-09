using ideaware.Models;
using ideaware.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;

namespace ideaware.Controllers
{
    [Authorize(Roles = "Facturas, Administrador")]
    public class FacturasController : Controller
    {
        private IdeawareEntities access = new IdeawareEntities();
        private JavaScriptSerializer serializer = new JavaScriptSerializer();
        // GET: Facturas
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Crear()
        {           
            return View();
        }

        public string Datos() {
            var productos = access.productos.Select(x=>new { id=x.id,nombre=x.nombre,valor=x.valor }).ToList();
            var clientes = access.clientes.Select(x => new { id = x.id, nombre = x.nombre, identificacion = x.identificacion }).ToList();
            return this.serializer.Serialize(new { productos=productos, clientes=clientes });
        }

        [HttpGet]
        public string Listado()
        {
            var facturas = access.facturas.Select(client => new {
                client.id,
                nombre=client.cliente.nombre               
            });
            return serializer.Serialize(new { facturas = facturas });
        }

        [HttpGet]
        public void Exportar(int id)
        {
            var factura = access.facturas.Find(id);
            double total = 0;
            using (MemoryStream stream = new MemoryStream())
            {
                
                XmlTextWriter xmlWriter = new XmlTextWriter(stream, System.Text.Encoding.ASCII);                
                xmlWriter.WriteStartDocument();               
                xmlWriter.WriteStartElement("Factura");                  
                xmlWriter.WriteStartElement("Productos");
                foreach(var elemento in factura.productos_factura) {
                    xmlWriter.WriteStartElement("Producto");
                    double valortotal = elemento.cantidad * elemento.valor_unitario;
                    xmlWriter.WriteElementString("Producto", elemento.producto.nombre);
                    xmlWriter.WriteElementString("Cantidad", elemento.cantidad.ToString());
                    xmlWriter.WriteElementString("ValorUnitario", elemento.valor_unitario.ToString());
                    xmlWriter.WriteElementString("ValorTotal", valortotal.ToString());
                    total += valortotal;
                    xmlWriter.WriteEndElement();
                }
                xmlWriter.WriteStartElement("Total");
                xmlWriter.WriteElementString("TotalFactura", total.ToString());              
                xmlWriter.WriteEndElement();                
                xmlWriter.WriteEndElement();
                xmlWriter.WriteEndElement();                
                xmlWriter.WriteEndDocument();                
                xmlWriter.Flush();                
                byte[] byteArray = stream.ToArray();                
                Response.Clear();
                Response.AppendHeader("Content-Disposition", "filename=MyExportedFile.xml");
                Response.AppendHeader("Content-Length", byteArray.Length.ToString());
                Response.ContentType = "application/octet-stream";
                Response.BinaryWrite(byteArray);
                xmlWriter.Close();
            }
        }

        [HttpPost]
        public string Save(FacturaViewModel facture)
        {

            if (!ModelState.IsValid)
            {
                IEnumerable<ModelError> errores = ModelState.Values.SelectMany(v => v.Errors);
                return serializer.Serialize(new { success = false, errores = errores });
            }

            factura factura = new factura() {
                cliente_id=facture.cliente.Value
            };

            foreach(var producto in facture.productos)
            {
                factura.productos_factura.Add(new productos_factura() {
                    productos_id=producto.id.Value,
                    cantidad=producto.cantidad.Value,
                    valor_unitario=producto.valor.Value
                });
            }

            access.facturas.Add(factura);
            access.SaveChanges();
            return serializer.Serialize(new { success = true});
        }
    }
}