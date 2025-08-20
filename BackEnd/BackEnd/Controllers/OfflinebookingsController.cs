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
    public class OfflinebookingsController : ControllerBase
    {
        private readonly Databasecontext _context;

        public OfflinebookingsController(Databasecontext context)
        {
            _context = context;
        }

        // GET: api/Offlinebookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Offlinebooking>>> GetOfflinebookings()
        {
            return await _context.Offlinebookings.ToListAsync();
        }

        // GET: api/Offlinebookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Offlinebooking>> GetOfflinebooking(Guid id)
        {
            var offlinebooking = await _context.Offlinebookings.FindAsync(id);

            if (offlinebooking == null)
            {
                return NotFound();
            }

            return offlinebooking;
        }

        // PUT: api/Offlinebookings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOfflinebooking(Guid id, Offlinebooking offlinebooking)
        {
            if (id != offlinebooking.Id)
            {
                return BadRequest();
            }

            _context.Entry(offlinebooking).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OfflinebookingExists(id))
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

        // POST: api/Offlinebookings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Offlinebooking>> PostOfflinebooking(Offlinebooking offlinebooking)
        {
            _context.Offlinebookings.Add(offlinebooking);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOfflinebooking", new { id = offlinebooking.Id }, offlinebooking);
        }

        // DELETE: api/Offlinebookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOfflinebooking(Guid id)
        {
            var offlinebooking = await _context.Offlinebookings.FindAsync(id);
            if (offlinebooking == null)
            {
                return NotFound();
            }

            _context.Offlinebookings.Remove(offlinebooking);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OfflinebookingExists(Guid id)
        {
            return _context.Offlinebookings.Any(e => e.Id == id);
        }
    }
}
