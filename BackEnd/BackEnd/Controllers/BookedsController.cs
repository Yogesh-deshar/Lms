using BackEnd.Data;
using BackEnd.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookedsController : ControllerBase
    {
        private readonly Databasecontext _context;
        private readonly UserManager<User> _userManager;

        public BookedsController(Databasecontext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Bookeds

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetBookeds()
        {
            try
            {
                var bookedItems = await _context.Bookeds
                    .Include(b => b.Book)
                    .ToListAsync();

                var result = new List<object>();

                foreach (var item in bookedItems)
                {
                    // Get user details using UserManager
                    var user = await _userManager.FindByIdAsync(item.User_id.ToString());

                    var bookedItemWithUser = new
                    {
                        Id = item.Id,
                        Book_Id = item.Book_Id,
                        User_id = item.User_id,
                        Booked_date = item.Booked_date,
                        Return_date = item.Return_date,
                        Book = item.Book,
                        User = user != null ? new
                        {
                            Id = user.Id,
                            Name = user.Name,
                            Email = user.Email,
                            UserName = user.UserName,
                            Address = user.Address,
                            PhoneNumber = user.PhoneNumber
                        } : null
                    };

                    result.Add(bookedItemWithUser);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching booked items", error = ex.Message });
            }
        }

        // GET: api/Bookeds/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booked>> GetBooked(Guid id)
        {
            var booked = await _context.Bookeds.FindAsync(id);

            if (booked == null)
            {
                return NotFound();
            }

            return booked;
        }

        // PUT: api/Bookeds/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooked(Guid id, Booked booked)
        {
            if (id != booked.Id)
            {
                return BadRequest();
            }

            _context.Entry(booked).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookedExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Bookeds
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        
        [HttpPost]
        public async Task<ActionResult<Booked>> PostBooked(Booked booked)
        {
            try
            {
                if (booked == null)
                {
                    return BadRequest("Invalid booking data.");
                }

                var book = await _context.Books.FindAsync(booked.Book_Id);
                if (book == null || book.Quantity <= 0)
                {
                    return BadRequest("Book is not available.");
                }

                book.Quantity--; // Decrease the quantity
                _context.Bookeds.Add(booked);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBooked), new { id = booked.Id }, booked);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine(ex);
                return StatusCode(500, "Internal server error. Please try again later.");
            }
        }

        // DELETE: api/Bookeds/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooked(Guid id)
        {
            var booked = await _context.Bookeds.FindAsync(id);
            if (booked == null)
            {
                return NotFound();
            }

            _context.Bookeds.Remove(booked);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookedExists(Guid id)
        {
            return _context.Bookeds.Any(e => e.Id == id);
        }
    }
}
