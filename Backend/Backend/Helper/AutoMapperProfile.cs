using AutoMapper;
using Backend.Controllers.Requests;
using Backend.Models;

namespace Backend.Helper;
public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterRequest, User>();
    }
}
