# PowerShell script to create a test user
Write-Host "Creating test user..." -ForegroundColor Green

# Test user data
$userData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    university = "Test University"
} | ConvertTo-Json

try {
    # Create test user using the admin endpoint
    $response = Invoke-WebRequest -Uri "https://sbhubwebapp2024-staging.azurewebsites.net/api/admin/create-test-user" -Method POST -Body $userData -ContentType "application/json"
    
    Write-Host "Response Status: $($response.StatusCode)" -ForegroundColor Yellow
    Write-Host "Response Body: $($response.Content)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error creating user: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
}

Write-Host "`nTest user credentials:" -ForegroundColor Green
Write-Host "Email: test@example.com" -ForegroundColor White
Write-Host "Password: password123" -ForegroundColor White 