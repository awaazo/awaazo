using Microsoft.Data.SqlClient;

namespace backendTest
{
    public class UnitTest1
    {

        // The following code is used to test the database connection.
        // It is not currently used to test the actual functionality of the application.

        private string _connectionString = System.IO.File.ReadAllText("../../../DbConnectionString.txt");

        [Fact]
        public void Test1()
        {
            // Placeholder for future tests.
            Assert.True(true);
        }

        [Fact]
        public void TestDBConnection()
        {
            // Given
            bool result = true;

            // When
            using (var dbConn = new SqlConnection(_connectionString))
            {
                try
                {
                    dbConn.Open();
                }
                catch (SqlException e) 
                {
                    result = false;
                    throw e;
                }
            }

            // Then
            Assert.True(result);
        }
    }
}