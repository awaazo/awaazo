FROM mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /app
COPY . .
RUN dotnet restore backendTest.csproj 
COPY DockerDbConnectionString.txt DbConnectionString.txt

ENTRYPOINT [ "dotnet", "test"]