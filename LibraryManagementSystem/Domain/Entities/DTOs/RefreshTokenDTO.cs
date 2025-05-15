namespace Domain.Entities.DTOs
{
    public class RefreshTokenDTO
    {
        public string RefreshToken { get; set; }
        public string AccessToken { get; set; } // New property for expired access token
    }
}
