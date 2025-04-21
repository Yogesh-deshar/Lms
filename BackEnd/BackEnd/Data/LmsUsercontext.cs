using BackEnd.Model;

using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;



namespace BackEnd.Data
{
    public class LmsUsercontext : IdentityDbContext<User>
    {
        public LmsUsercontext(DbContextOptions<LmsUsercontext> options) : base(options)
        {
        }

   
    }
   
    
}
