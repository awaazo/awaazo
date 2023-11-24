using System.Reflection;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public static class ControllerBaseExt
{
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void LogDebugControllerAPICall<T>(
        this ControllerBase controllerBase,
        ILogger<T> logger,
        [CallerMemberName] string callerName = "" // CallerMemberName attribute
    ) {
        logger.LogDebug("Using {0}::{1}", typeof(T).Name, callerName);
    }
    
    [MethodImpl(MethodImplOptions.AggressiveInlining)]
    public static void LogErrorAPICall<T>(
        this ControllerBase controllerBase,
        ILogger<T> logger,
        Exception e,
        bool isCritical = false,
        [CallerMemberName] string callerName = "" // CallerMemberName attribute
    ) {
        Action<string, object[]> fn = isCritical ? logger.LogCritical : logger.LogError;
        fn("error at {0}::{1} => {2}", new object[]{typeof(T).Name, callerName, e.Message});
    }
}