using BackEnd.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public UserController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            try
            {
                if (string.IsNullOrEmpty(login.UserName))
                {
                    return BadRequest("Username is required");
                }

                // First try to find by username
                User user_ = await _userManager.FindByNameAsync(login.UserName);

                // If not found by username, try to find by email
                if (user_ == null)
                {
                    user_ = await _userManager.FindByEmailAsync(login.UserName);
                }

                if (user_ == null)
                {
                    return Unauthorized("Invalid username/email or password");
                }

                // Check if email is confirmed
                if (!user_.EmailConfirmed)
                {
                    user_.EmailConfirmed = true;
                    await _userManager.UpdateAsync(user_);
                }

                // Attempt to sign in
                var result = await _signInManager.PasswordSignInAsync(
                    user_,
                    login.Password,
                    login.Rember,
                    lockoutOnFailure: false
                );

                if (!result.Succeeded)
                {
                    return Unauthorized("Invalid username/email or password");
                }

                // Update last login time
                user_.LastLogin = DateTime.Now;
                var updateResult = await _userManager.UpdateAsync(user_);

                return Ok(new { message = "Login successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("logout"),Authorize]
        public async Task<IActionResult> Logout()
        {
            string message = "Logout";
            try
            {
                await _signInManager.SignOutAsync();
                message = "Logout successfully";
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(new { message = message });
        }





        [HttpPost("register")]
        public async Task<IActionResult> Register( User user)
        {
            string message = "";
            IdentityResult result = new IdentityResult();

            try
            {
                User user_ = new User()
                {
                    UserName = user.UserName,
                    Email = user.Email,
                    Name = user.Name,
                    Address = user.Address,
                    CreateDate = DateTime.Now,
                    Modifydate = DateTime.Now,
                    IsAdmin = false,
                    PhoneNumber = user.PhoneNumber,
                    LastLogin = DateTime.Now,
                    PasswordHash = user.PasswordHash

                };

                result = await _userManager.CreateAsync(user_);
                if (result.Succeeded)
                {
                    message = "User created successfully";
                    return Ok(message);
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        message += error.Description + "\n";
                    }
                    return BadRequest(message);
                }

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
            return Ok(new {message = message , result = result});
        }



        [HttpGet("admin"),Authorize]
        public ActionResult Admin()
        {
            string[] partner = { "Zadx0" };
            return Ok(new { trustedPartners = partner });
        }

        [HttpGet("home/{email}"), Authorize]
        public async Task<ActionResult> AdminPage(string email)
        {
         User user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound("User not found");
            }
            return Ok(new { user = user });
        }

        [HttpGet("jfljfjldkj")]
        public async Task<ActionResult> CheckUser(string email)
        {
          string message = "";
            User currentuser = new();
            try
            {
                var user_ = HttpContext.User;
                var principals = new ClaimsPrincipal(user_);
                var result = _signInManager.IsSignedIn(principals);
                if (result)
                {
                    currentuser = await _signInManager.UserManager.GetUserAsync(principals);
                }
                else
                {
                    return Unauthorized("User not found");
                }
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(new {message = message, user_ = currentuser });
        }
    }
}
