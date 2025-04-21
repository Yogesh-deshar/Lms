
using BackEnd.Model;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class Databasecontext : DbContext
    {
        public Databasecontext(DbContextOptions<Databasecontext> options) : base(options)
        {
        }
     
        public DbSet<Books> Books { get; set; }
        public DbSet<Booked> Bookeds { get; set; }
    }
    
}
