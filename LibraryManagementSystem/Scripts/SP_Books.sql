USE Library;
GO

ALTER PROCEDURE SP_Books
    @Flag NVARCHAR(2),
    @BookId INT = NULL,
    @Title NVARCHAR(255) = NULL,
    @AuthorId INT = NULL,
    @Genre NVARCHAR(100) = NULL,
    @ISBN NVARCHAR(13) = NULL,
    @Quantity INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Flag = 'SE'
    BEGIN
        IF @BookId IS NULL
            SELECT * FROM Books ORDER BY BookId DESC;
        ELSE
            SELECT * FROM Books WHERE BookId = @BookId;
    END
    ELSE IF @Flag = 'I'
    BEGIN
        INSERT INTO Books (Title, AuthorId, Genre, ISBN, Quantity)
        VALUES (@Title, @AuthorId, @Genre, @ISBN, @Quantity);
        SELECT SCOPE_IDENTITY() AS BookId;
    END
    ELSE IF @Flag = 'U'
    BEGIN
        UPDATE Books
        SET Title = @Title,
            AuthorId = @AuthorId,
            Genre = @Genre,
            ISBN = @ISBN,
            Quantity = @Quantity
        WHERE BookId = @BookId;
    END
    ELSE IF @Flag = 'D'
    BEGIN
        DELETE FROM Books WHERE BookId = @BookId;
    END
END;
GO