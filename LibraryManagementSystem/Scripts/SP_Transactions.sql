USE Library;
GO

ALTER PROCEDURE SP_Transactions
    @Flag NVARCHAR(2),
    @TransactionId INT = NULL,
    @StudentId INT = NULL,
    @UserId INT = NULL,
    @BookId INT = NULL,
    @TransactionType NVARCHAR(10) = NULL,
    @Date DATETIME = NULL,
    @Search NVARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @Flag = 'SE'
    BEGIN
        IF @TransactionId IS NULL AND @Search IS NULL
        BEGIN
            SELECT 
                T.TransactionId,
                S.StudentId,
                S.Name AS StudentName,
                U.UserId,
                U.Username,
                B.BookId,
                B.Title AS BookTitle,
                T.TransactionType,
                T.Date
            FROM Transactions T
            LEFT JOIN Students S ON T.StudentId = S.StudentId
            LEFT JOIN Users U ON T.UserId = U.UserId
            LEFT JOIN Books B ON T.BookId = B.BookId
            ORDER BY T.TransactionId DESC;
        END
        ELSE IF @TransactionId IS NULL AND @Search IS NOT NULL
        BEGIN
            SELECT 
                T.TransactionId,
                S.StudentId,
                S.Name AS StudentName,
                U.UserId,
                U.Username,
                B.BookId,
                B.Title AS BookTitle,
                T.TransactionType,
                T.Date
            FROM Transactions T
            LEFT JOIN Students S ON T.StudentId = S.StudentId
            LEFT JOIN Users U ON T.UserId = U.UserId
            LEFT JOIN Books B ON T.BookId = B.BookId
            WHERE S.Name LIKE '%' + @Search + '%' OR
                  U.Username LIKE '%' + @Search + '%' OR
                  B.Title LIKE '%' + @Search + '%'
            ORDER BY T.TransactionId DESC;
        END
        ELSE
        BEGIN
            SELECT 
                T.TransactionId,
                S.Name AS StudentName,
                U.Username,
                B.Title AS BookTitle,
                T.TransactionType,
                T.Date
            FROM Transactions T
            LEFT JOIN Students S ON T.StudentId = S.StudentId
            LEFT JOIN Users U ON T.UserId = U.UserId
            LEFT JOIN Books B ON T.BookId = B.BookId
            WHERE T.TransactionId = @TransactionId;
        END
    END
    ELSE IF @Flag = 'I'
    BEGIN
        INSERT INTO Transactions (StudentId, UserId, BookId, TransactionType, Date)
        VALUES (@StudentId, @UserId, @BookId, @TransactionType, @Date);
        SELECT SCOPE_IDENTITY() AS TransactionId;
    END
    ELSE IF @Flag = 'U'
    BEGIN
        UPDATE Transactions
        SET StudentId = @StudentId,
            UserId = @UserId,
            BookId = @BookId,
            TransactionType = @TransactionType,
            Date = @Date
        WHERE TransactionId = @TransactionId;
    END
    ELSE IF @Flag = 'D'
    BEGIN
        DELETE FROM Transactions WHERE TransactionId = @TransactionId;
    END
END;
GO