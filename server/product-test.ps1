$form = @{
    name = "Wireless Mouse"
    category = "Accessories"
    price = "19.99"
    description = "Ergonomic wireless mouse"
    image = Get-Item "C:\Users\A.S.PRIDE\Downloads\Haris_pic.png"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Post -Headers @{ Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODJmNjFjZjg1YzNiYjdjMGFjYjUzMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc4NzA1MjM0MSwiZXhwIjoxNzg3NjU3MTQxfQ.YT-KrzxA_-4lRNarDGoLnep3bZ0Odk0O-yn2LgZHfm4" } -Form $form
