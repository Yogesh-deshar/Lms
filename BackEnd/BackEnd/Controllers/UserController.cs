using BackEnd.Data;
using BackEnd.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;




namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<User> _logger;
        private readonly IConfiguration _configuration;
        private readonly LmsUsercontext _context;
        public UserController(UserManager<User> userManager, SignInManager<User> signInManager , IConfiguration configuration, ILogger<User> logger , LmsUsercontext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _logger = logger;
            _context = context;
        }


        [HttpPost("login")]
        public async Task<ActionResult> LoginUser(Login login)
        {
            try
            {
                _logger.LogInformation("Login attempt for email: {Email}", login.Email);

                if (login == null)
                {
                    _logger.LogWarning("Login attempt with null login object");
                    return BadRequest(new { message = "Login data is required." });
                }

                if (string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Password))
                {
                    _logger.LogWarning("Invalid login attempt - empty email or password");
                    return BadRequest(new { message = "Email and password are required." });
                }

                _logger.LogInformation("Looking up user with email: {Email}", login.Email);
                User user_ = await _userManager.FindByEmailAsync(login.Email);

                if (user_ == null)
                {
                    _logger.LogWarning("User not found for email: {Email}", login.Email);
                    return BadRequest(new { message = "User not found. Please check your email." });
                }

                _logger.LogInformation("Attempting password sign in for user: {Email}", login.Email);
                var result = await _signInManager.PasswordSignInAsync(user_, login.Password, login.Remember, false);

                if (!result.Succeeded)
                {
                    _logger.LogWarning("Login failed for user: {Email}, Result: {Result}", login.Email, result.ToString());
                    if (result.IsLockedOut)
                    {
                        return BadRequest(new { message = "Account is locked. Please try again later." });
                    }
                    if (result.IsNotAllowed)
                    {
                        return BadRequest(new { message = "Account is not allowed to sign in." });
                    }
                    return Unauthorized(new { message = "Invalid password. Please check your credentials and try again." });
                }

                _logger.LogInformation("Creating claims for user: {Email}", login.Email);
                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user_.UserName),
            new Claim(ClaimTypes.Email, user_.Email),
            new Claim("Name", user_.Name),
            new Claim("Address", user_.Address),
            new Claim("PhoneNumber", user_.PhoneNumber),
             //new Claim("IsAdmin", user_.IsAdmin.ToString()) // Add IsAdmin claim
        };

                _logger.LogInformation("Getting roles for user: {Email}", login.Email);
                var roles = await _userManager.GetRolesAsync(user_);
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

                _logger.LogInformation("Creating JWT token for user: {Email}", login.Email);
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddDays(1),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                _logger.LogInformation("Login successful for user: {Email}", login.Email);

                return Ok(new
                {
                    message = "Login Successful.",
                    user = new
                    {
                        id = user_.Id,
                        email = user_.Email,
                        name = user_.Name,
                        address = user_.Address,
                        phoneNumber = user_.PhoneNumber,
                        userName = user_.UserName,
                         isAdmin = user_.IsAdmin // Add isAdmin to response
                    },
                    token = tokenString
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for email: {Email}. Stack trace: {StackTrace}",
                    login?.Email ?? "unknown", ex.StackTrace);
                return StatusCode(500, new
                {
                    message = "An error occurred during login. Please try again.",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
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
        public async Task<IActionResult> Register(User user)
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
                    LastLogin = DateTime.Now
                    // Remove this line: PasswordHash = user.PasswordHash
                };

                // Use the password directly, let Identity handle hashing
                result = await _userManager.CreateAsync(user_, user.PasswordHash);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user_, "User");
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new { message = message, result = result });
        }



        [HttpGet("admin"),Authorize]
        public ActionResult Admin()
        {
            string[] partner = { "Zadx0" };
            return Ok(new { trustedPartners = partner });
        }


        [HttpGet("home/{email}"), Authorize]
        public async Task<ActionResult> HomePage(string Email)
        {
            try
            {
                User userInfo = await _userManager.FindByEmailAsync(Email);
                if (userInfo == null)
                {
                    return BadRequest(new { message = "User not found." });
                }

                return Ok(new
                {
                    userInfo = new
                    {
                        name = userInfo.Name,
                        email = userInfo.Email,
                        userName = userInfo.UserName,
                        address = userInfo.Address,
                        phoneNumber = userInfo.PhoneNumber
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in HomePage endpoint");
                return StatusCode(500, new { message = "An error occurred while fetching user information." });
            }
        }


        [HttpGet("xhtlekd")]
        public async Task<ActionResult> CheckUser()
        {
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
                    return Forbid();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Something went wrong please try again. " + ex.Message });
            }

            return Ok(new { message = "Logged in", user = currentuser });
        }




        //[HttpGet("xhtlekd")]
        //public async Task<IActionResult> GetUser()
        //{
        //    try
        //    {
        //        // Example: get the current user from the User claims or database
        //        var userEmail = User.Identity?.Name; // or get from claims
        //        if (string.IsNullOrEmpty(userEmail))
        //            return Unauthorized();

        //        var user = await _userManager.FindByEmailAsync(userEmail);
        //        if (user == null)
        //            return NotFound();

        //        // Return user data (map to DTO if needed)
        //        return Ok(new { user.Email, user.UserName /* etc */ });
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log exception
        //        _logger.LogError(ex, "Error in GetUser");
        //        return StatusCode(500, "Internal server error");
        //    }
        //}




        //[HttpPost("create-test-user")]
        //public async Task<ActionResult> CreateTestUser()
        //{
        //    try
        //    {
        //        var user = new User
        //        {
        //            UserName = "test@example.com",
        //            Email = "test@example.com",
        //            EmailConfirmed = true,
        //            Name = "Test User",
        //            CreateDate = DateTime.Now,
        //            Modifydate = DateTime.Now,
        //            IsAdmin = false,
        //            LastLogin = DateTime.Now
        //        };

        //        var result = await _userManager.CreateAsync(user, "TestPassword123!");

        //        if (result.Succeeded)
        //        {
        //            return Ok(new { message = "Test user created successfully. Email: test@example.com, Password: TestPassword123!" });
        //        }

        //        return BadRequest(new { message = "Failed to create test user. " + string.Join(", ", result.Errors.Select(e => e.Description)) });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { message = "Something went wrong, please try again. " + ex.Message });
        //    }
        //}
    }
}
