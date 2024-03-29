using System.Reflection;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public static class ControllerBaseExt
{
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void LogDebugControllerAPICall<T>(this ControllerBase controllerBase, ILogger<T> logger, [CallerMemberName] string callerName = "" )
    {
        logger.LogInformation("Using {0}::{1}", typeof(T).Name, callerName);
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "ServerFiles", "ASP_Logs");
        if (!File.Exists(filePath)) Directory.CreateDirectory(filePath);
        string fullFilePath = Path.Combine(filePath, DateTime.Now.ToString("yyyy-MM-dd") + "_INFO_LOGS.txt");
        File.AppendAllText(fullFilePath, "INFORMATION: " + DateTime.Now.ToString() + " " + typeof(T).Name + "::" + callerName + "\n");
    }

    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void LogErrorAPICall<T>(this ControllerBase controllerBase, ILogger<T> logger, Exception e, bool isCritical = false, [CallerMemberName] string callerName = "" )
    {
        if(isCritical)
            logger.LogCritical("Critical Error at {0}::{1} => {2}", typeof(T).Name, callerName, e.Message);
        else
            logger.LogError("Error at {0}::{1} => {2}", typeof(T).Name, callerName, e.Message);

        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "ServerFiles", "ASP_Logs");
        if (!File.Exists(filePath)) Directory.CreateDirectory(filePath);
        string fullFilePath = Path.Combine(filePath, DateTime.Now.ToString("yyyy-MM-dd") + "_ERROR_LOGS.txt");

        if(isCritical)
            File.AppendAllText(fullFilePath, "CRITICAL ERROR: " + DateTime.Now.ToString() + " " + typeof(T).Name + "::" + callerName + " => " + e.Message + "\n");
        else
            File.AppendAllText(fullFilePath, "ERROR: " + DateTime.Now.ToString() + " " + typeof(T).Name + "::" + callerName + " => " + e.Message + "\n");
    }
}