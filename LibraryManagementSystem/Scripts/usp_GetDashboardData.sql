USE Library;
GO

ALTER PROCEDURE usp_GetDashboardData
    @Flag VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    IF @Flag = 'GetDashboardData'
    BEGIN
        SELECT
            (SELECT COUNT(*) FROM Students) AS TotalStudentCount,
            (SELECT COUNT(*) FROM Books) AS TotalBookCount,
            (SELECT COUNT(*) FROM Transactions) AS TotalTransactionCount,
            (SELECT COUNT(*) FROM Transactions WHERE TransactionType = 'Borrow') AS TotalBorrowedBooks,
            (SELECT COUNT(*) FROM Transactions WHERE TransactionType = 'Return') AS TotalReturnedBooks;
    END
    ELSE IF @Flag = 'GetOverdueBorrowers'
    BEGIN
        SELECT 
            S.Name AS Name,
            T.TransactionId AS BorrowedId
        FROM Transactions T
        INNER JOIN Students S ON T.StudentId = S.StudentId
        WHERE 
            T.TransactionType = 'Borrow' AND
            DATEDIFF(DAY, T.Date, GETDATE()) > 30;
    END
END;
GO