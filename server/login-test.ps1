$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email": "admin@test.com", "password": "test123"}'
$response.token