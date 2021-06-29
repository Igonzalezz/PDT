using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BE_PDT.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [Column(TypeName ="varchar(100)")]
        public string Nombre { get; set; }
        [Required]
        [Column(TypeName = "varchar(200)")]
        public string Direccion { get; set; }
        [Required]
        [Column(TypeName = "varchar(10)")]
        public string Telefono { get; set; }
        [Required]
        [Column(TypeName = "varchar(18)")]
        public string CURP { get; set; }
        [Column(TypeName = "varchar(10)")]
        public string FechaReg { get; set; }
    }

   
}