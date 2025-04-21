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
    public class BooksController : ControllerBase
    {
        private readonly Databasecontext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public BooksController(Databasecontext context ,IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }


        [HttpGet("images/{imageName}")]
        public async Task<IActionResult> GetImage(string imageName)
        {
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound();
            }

            var imageBytes = await System.IO.File.ReadAllBytesAsync(imagePath);
            return File(imageBytes, "image/jpeg"); // or appropriate mime type
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Books>>> GetBooks()
        {

            return await _context.Books.Select(x=> new Books()
            {
                Id = x.Id,
                BookName = x.BookName,
                Author = x.Author,
                Description = x.Description,
                Class = x.Class,
                Quantity = x.Quantity,
                Image = x.Image,
                ImageSrc = $"{Request.Scheme}://{Request.Host}/api/Books/images/{x.Image}"
            }).ToListAsync();
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Books>> GetBooks(Guid id)
        {
            var books = await _context.Books.FindAsync(id);

            if (books == null)
            {
                return NotFound();
            }

            return books;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooks(Guid id, Books books)
        {
            if (id != books.Id)
            {
                return BadRequest();
            }

            _context.Entry(books).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BooksExists(id))
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Books>> PostBooks([FromForm] Books books)
        {
            if (books?.ImageFile == null)
            {
                return BadRequest("Image file is required");
            }


            try
            {
                books.Image = await saveImage(books.ImageFile);
                _context.Books.Add(books);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetBooks), new { id = books.Id }, books);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }




        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooks(Guid id)
        {
            var books = await _context.Books.FindAsync(id);
            if (books == null)
            {
                return NotFound();
            }

            _context.Books.Remove(books);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BooksExists(Guid id)
        {
            return _context.Books.Any(e => e.Id == id);
        }

        //[NonAction]
        //public async Task<string> saveImage(IFormFile imageFile)
        //{
        //    string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
        //    imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
        //    var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName); // Use imageName here

        //    Directory.CreateDirectory(Path.GetDirectoryName(imagePath)); // Ensure directory exists

        //    using (var fileStream = new FileStream(imagePath, FileMode.Create))
        //    {
        //        await imageFile.CopyToAsync(fileStream);
        //    }
        //    return imageName;
        //}

        [NonAction]
        public async Task<string> saveImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.FileName == null)
            {
                throw new ArgumentException("Invalid image file");
            }

            // Validate file type
            if (!new[] { ".jpg", ".png", ".gif" }.Contains(Path.GetExtension(imageFile.FileName).ToLower()))
            {
                throw new ArgumentException("Invalid file type");
            }

            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);

            Directory.CreateDirectory(Path.GetDirectoryName(imagePath));

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }





    }
}
