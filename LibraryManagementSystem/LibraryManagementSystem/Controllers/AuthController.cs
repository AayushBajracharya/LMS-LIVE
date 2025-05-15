using LibraryManagementSystem.Modles;
using LibraryManagementSystem.Repositories;
using LibraryManagementSystem.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using LibraryManagementSystem.Utilities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Domain.Entities.DTOs;

namespace LibraryManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenHelper _jwtHelper;
        private readonly IConfiguration _configuration;

        public AuthController(IUserRepository userRepository, JwtTokenHelper jwtHelper, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] Users users)
        {
            users.Password = HashPassword(users.Password);
            await _userRepository.AddUserAsync(users);

            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginRequest)
        {
            var user = await _userRepository.GetUserByUsernameAsync(loginRequest.Username);

            if (user == null || !VerifyPassword(loginRequest.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            var accessToken = _jwtHelper.GenerateAccessToken(user);
            var refreshToken = _jwtHelper.GenerateRefreshToken(user);

            return Ok(new
            {
                accessToken,
                refreshToken,
                userId = user.UserId
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDTO refreshTokenRequest)
        {
            if (string.IsNullOrEmpty(refreshTokenRequest.RefreshToken))
            {
                return BadRequest(new { message = "Refresh token is required" });
            }

            try
            {
                // Validate the refresh token
                var principal = GetPrincipalFromToken(refreshTokenRequest.RefreshToken, validateLifetime: true);
                var usernameFromRefreshToken = principal?.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(usernameFromRefreshToken))
                {
                    return Unauthorized(new { message = "Invalid refresh token" });
                }

                // Optionally parse the expired access token (without validating lifetime)
                string usernameFromAccessToken = null;
                if (!string.IsNullOrEmpty(refreshTokenRequest.AccessToken))
                {
                    try
                    {
                        var accessPrincipal = GetPrincipalFromToken(refreshTokenRequest.AccessToken, validateLifetime: false);
                        usernameFromAccessToken = accessPrincipal?.FindFirst(ClaimTypes.Name)?.Value;
                    }
                    catch (SecurityTokenException)
                    {
                        // Ignore invalid access token (e.g., tampered or malformed)
                    }
                }

                // Verify that the usernames match (if access token provided and valid)
                if (usernameFromAccessToken != null && usernameFromAccessToken != usernameFromRefreshToken)
                {
                    return Unauthorized(new { message = "Access token and refresh token do not belong to the same user" });
                }

                // Verify user exists
                var user = await _userRepository.GetUserByUsernameAsync(usernameFromRefreshToken);
                if (user == null)
                {
                    return Unauthorized(new { message = "User not found" });
                }

                // Generate new tokens
                var newAccessToken = _jwtHelper.GenerateAccessToken(user);
                var newRefreshToken = _jwtHelper.GenerateRefreshToken(user); // Rotate refresh token

                return Ok(new
                {
                    accessToken = newAccessToken,
                    refreshToken = newRefreshToken,
                    userId = user.UserId
                });
            }
            catch (SecurityTokenException)
            {
                return Unauthorized(new { message = "Invalid or expired refresh token" });
            }
        }

        private ClaimsPrincipal GetPrincipalFromToken(string token, bool validateLifetime)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = validateLifetime, // Control lifetime validation
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidAudience = _configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]))
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);

            if (validatedToken is not JwtSecurityToken)
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            return HashPassword(enteredPassword) == storedHash;
        }
    }
}