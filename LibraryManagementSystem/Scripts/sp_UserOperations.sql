USE Library;
GO

ALTER PROCEDURE sp_UserOperations
    @Flag CHAR(1),
    @Username NVARCHAR(100),
    @Password NVARCHAR(255) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Role NVARCHAR(10) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Flag = 'S'
    BEGIN
        INSERT INTO Users (Username, Password, Email, Role)
        VALUES (@Username, @Password, @Email, @Role);
        SELECT SCOPE_IDENTITY() AS UserId;
    END
    ELSE IF @Flag = 'L'
    BEGIN
        SELECT *
        FROM Users
        WHERE Username = @Username;
    END
    ELSE
    BEGIN
        THROW 50001, 'Invalid operation flag. Use ''S'' for Sign-Up or ''L'' for Login.', 1;
    END
END;
GO