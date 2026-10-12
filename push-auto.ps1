param(
    [string]$Message = "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Technotama LMS - Automated Git Push Sync " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ">>> Menambahkan seluruh perubahan (git add -A)..." -ForegroundColor Yellow
git add -A

$changes = git status --porcelain
if (-not $changes) {
    Write-Host ">>> Tidak ada perubahan yang perlu di-commit." -ForegroundColor Green
} else {
    Write-Host ">>> Melakukan commit dengan pesan: '$Message'..." -ForegroundColor Yellow
    git commit -m "$Message"
    
    Write-Host ">>> Melakukan push ke origin main..." -ForegroundColor Yellow
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ">>> SUKSES: Perubahan berhasil di-push ke GitHub!" -ForegroundColor Green
    } else {
        Write-Host ">>> GAGAL: Terjadi kendala saat push ke GitHub." -ForegroundColor Red
    }
}
