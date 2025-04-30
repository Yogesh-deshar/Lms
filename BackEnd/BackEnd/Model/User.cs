using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;



namespace BackEnd.Model
{
    public class User : IdentityUser

    {

        [MaxLength(50)]
        public string? Name { get; set; }
        public string? Address { get; set; }
       
        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? Modifydate { get; set; }

        public bool? IsAdmin { get; set; }
        public DateTime LastLogin { get; internal set; }
      
    }
}
