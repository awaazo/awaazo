
using System;

namespace Backend.Infrastructure
{
    public class FileLogger : ILogger
    {
        private static object _lock = new object();
        private const int FILE_SIZE_LIMIT = 1000;
        
        public FileLogger()
        {
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            string filePath = Directory.GetCurrentDirectory() + @"\Logs\";
            if (!File.Exists(filePath)) Directory.CreateDirectory(filePath);
            if (formatter == null) return;
            
            lock (_lock)
            {
                string fullFilePath = Path.Combine(filePath, DateTime.Now.ToString("yyyy-MM-dd") + "LOG_1.txt");
                string exc = "";
                if (exception != null)
                {
                    exc = exception.GetType() + ": " + exception.Message + "\n" + exception.StackTrace + "\n";
                    File.AppendAllText(fullFilePath, "ERROR: " + DateTime.Now.ToString() + " " + formatter(state, exception) + "\n" + exc);
                    return;
                }
                File.AppendAllText(fullFilePath, "DEBUG: " + DateTime.Now.ToString() + " " + state + "\n");
            }
        }

        // Checking if there are too many logs in this file, create a new one at the same directory
        private string CheckFileLength(string filePath, int number = 1)
        {
            var fileSize = File.ReadLines(filePath).Count();
            if (fileSize <= FILE_SIZE_LIMIT)
            {   
                return filePath;
            }

            // Split it on the the LOG_ part, increment the number and try again
            number++;
            var newFilePath = filePath.Split("_").First() + number;
            return CheckFileLength(newFilePath, number);
        }
    }
}
