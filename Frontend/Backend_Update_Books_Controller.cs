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

        public BooksController(Databasecontext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }

        // PUT: api/Books/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBooks(Guid id, [FromForm] Books books)
        {
            if (id != books.Id)
            {
                return BadRequest("ID mismatch");
            }

            try
            {
                var existingBook = await _context.Books.FindAsync(id);
                if (existingBook == null)
                {
                    return NotFound("Book not found");
                }

                // Update basic properties
                existingBook.BookName = books.BookName;
                existingBook.Author = books.Author;
                existingBook.Description = books.Description;
                existingBook.Class = books.Class;
                existingBook.Quantity = books.Quantity;

                // Handle image update if new image is provided
                if (books.ImageFile != null)
                {
                    // Delete old image if it exists
                    if (!string.IsNullOrEmpty(existingBook.Image))
                    {
                        var oldImagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", existingBook.Image);
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    // Save new image
                    existingBook.Image = await saveImage(books.ImageFile);
                }

                _context.Entry(existingBook).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Book updated successfully", book = existingBook });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BooksExists(id))
                {
                    return NotFound("Book not found");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [NonAction]
        public async Task<string> saveImage(IFormFile imageFile)
        {
            if (imageFile == null || imageFile.FileName == null)
            {
                throw new ArgumentException("Invalid image file");
            }

            // Validate file type
            if (!new[] { ".jpg", ".png", ".gif", ".jpeg" }.Contains(Path.GetExtension(imageFile.FileName).ToLower()))
            {
                throw new ArgumentException("Invalid file type. Only jpg, png, gif, jpeg are allowed.");
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

        private bool BooksExists(Guid id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}