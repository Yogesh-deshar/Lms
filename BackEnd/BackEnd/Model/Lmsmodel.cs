using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Model
{
 


    

    //public class Admin
    //{
    //    public Guid Id { get; set; }
    //    public string? Name { get; set; }
    //    public string? Email { get; set; }
    //    public string   ? Password { get; set; }

    //}

    public class Books
    {
        public Guid Id { get; set; }
        public string? BookName { get; set; }
        public string? Author { get; set; }
        public string? Description { get; set; }
        public string? Class { get; set; }
       
        public string? Image { get; set; }
        public int? Quantity { get; set; }

        [NotMapped]
        public IFormFile? ImageFile { get; set; }

        [NotMapped]
        public string ImageSrc { get; set; }

    }


    public class Booked
    {
        public Guid Id { get; set; }    
        public Guid  Book_Id { get; set; }
    
        public Guid User_id { get; set; }
        public Books? Book { get; set; } 
        public User? User { get; set; }

        public DateTime Booked_date { get; set; }
        public DateTime Return_date { get; set; }
    }

    public class Offlinebooking
    {
        public Guid Id { get; set; }
        public string? BookName { get; set; }
      
        public string? Class { get; set; }
       public string? Bookedby { get; set; }
        public DateTime Booked_date { get; set; }
        public DateTime Return_date { get; set; }


    }
}
