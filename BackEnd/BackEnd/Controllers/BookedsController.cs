using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackEnd.Data;
using BackEnd.Model;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookedsController : ControllerBase
    {
        private readonly Databasecontext _context;

        public BookedsController(Databasecontext context)
        {
            _context = context;
        }

        // GET: api/Bookeds
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booked>>> GetBookeds()
        {
            return await _context.Bookeds.Include(b => b.Book).Include(u => u.User).ToListAsync();
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
