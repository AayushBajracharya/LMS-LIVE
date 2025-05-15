USE Library;
GO

ALTER PROCEDURE SP_Authors
    @Flag NVARCHAR(2),
    @AuthorId INT = NULL,
    @Name NVARCHAR(255) = NULL,
    @Bio NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Flag = 'SE'
    BEGIN
        IF @AuthorId IS NULL
            SELECT * FROM Authors ORDER BY AuthorId DESC;
        ELSE
            SELECT * FROM Authors WHERE AuthorId = @AuthorId;
    END
    ELSE IF @Flag = 'I'
    BEGIN
        INSERT INTO Authors (Name, Bio)
        VALUES (@Name, @Bio);
        SELECT SCOPE_IDENTITY() AS AuthorId;
    END
    ELSE IF @Flag = 'U'
    BEGIN
        UPDATE Authors
        SET Name = @Name,
            Bio = @Bio
        WHERE AuthorId = @AuthorId;
    END
    ELSE IF @Flag = 'D'
    BEGIN
        DELETE FROM Authors WHERE AuthorId = @AuthorId;
    END
END;
GO