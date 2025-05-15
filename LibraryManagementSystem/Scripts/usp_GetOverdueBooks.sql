USE Library;
GO

ALTER PROCEDURE usp_GetOverdueBooks
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        S.StudentId AS StudentId,
        S.Name AS Name,
        S.Email AS Email,
        B.Title AS BookTitle
    FROM 
        Transactions T
    INNER JOIN 
        Students S ON T.StudentId = S.StudentId
    INNER JOIN 
        Books B ON T.BookId = B.BookId
    WHERE 
        T.TransactionType = 'Borrow'
        AND NOT EXISTS (
            SELECT 1 
            FROM Transactions T2 
            WHERE 
                T2.TransactionType = 'Return' 
                AND T2.BookId = T.BookId
                AND T2.StudentId = T.StudentId
                AND T2.Date > T.Date
        )
        AND DATEDIFF(DAY, T.Date, GETDATE()) > 30;
END;
GO