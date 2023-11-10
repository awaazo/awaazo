using AutoMapper.Internal;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("subscription")]
    [Authorize]
    public class SubscriptionController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ISubscriptionService _subscriptionService;
        public SubscriptionController(IAuthService authService, ISubscriptionService subscriptionService) { 
            _authService = authService;
            _subscriptionService = subscriptionService;
        }

        [HttpPost("{PodcastId}/subscribe")]
        public async Task<IActionResult> Subscribe(Guid PodcastId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");


                return await _subscriptionService.SubscribeAsync(PodcastId, user) ? Ok("Successfully Subscribed to the Podcast"):Ok("Failed to subscribe the Podcast");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpPost("{PodcastId}/unsubscribe")]
        public async Task<IActionResult> unsubscribe(Guid PodcastId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");


                return await _subscriptionService.UnsubscribeAsync(PodcastId, user) ? Ok("Successfully unsubscribed to the Podcast") : Ok("Failed to unsubscribe the Podcast");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("{PodcastId}/IsSubscribed")]
        public async Task<IActionResult> IsSubscribed(Guid PodcastId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");


                return Ok(new { IsSubscribed =  await _subscriptionService.IsSubscribed(PodcastId, user) }) ;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }


        [HttpGet("MySubscriptions")]
        public async Task<IActionResult> MySubscriptions()
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");


                return Ok(await _subscriptionService.MySubscriptionsAsync(user, GetDomainUrl(HttpContext))); 
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        [HttpGet("{PodcastId}/GetAllPodcastSubscriber")]
        public async Task<IActionResult> GetAllPodcastSubscriber(Guid PodcastId)
        {
            try
            {
                // Identify User from JWT Token
                User? user = await _authService.IdentifyUserAsync(HttpContext);

                // If User is not found, return 404
                if (user is null)
                    return NotFound("User does not exist.");


                return Ok(await _subscriptionService.GetPodcastSubscriptionAsync(PodcastId,GetDomainUrl(HttpContext)));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }

        }

        /// <summary>
        /// Returns the domain url of the server.
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private static string GetDomainUrl(HttpContext context)
        {
            string domain = "";
            domain += "http";
            if (context.Request.IsHttps)
                domain += "s";
            domain += @"://" + context.Request.Host + @"/";

            return domain;
        }





    }
}
