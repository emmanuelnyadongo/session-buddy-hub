# PowerShell script to test authentication endpoints
Write-Host "Testing Authentication Endpoints..." -ForegroundColor Green

# Test user data
$userData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    university = "Test University"
} | ConvertTo-Json

$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "`n1. Testing Registration..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://sbhubwebapp2024-staging.azurewebsites.net/api/auth/register" -Method POST -Body $userData -ContentType "application/json"
    Write-Host "Registration Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Registration Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Registration Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n2. Testing Login..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://sbhubwebapp2024-staging.azurewebsites.net/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Login Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Login Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Login Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
}

Write-Host "`n3. Testing Debug Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://sbhubwebapp2024-staging.azurewebsites.net/api/admin/debug" -Method GET
    Write-Host "Debug Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Debug Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "Debug Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response: $responseBody" -ForegroundColor Red
    }
} 