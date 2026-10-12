param(
    [string]$Message = "Auto update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Technotama LMS - Automated Git Push Sync " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ">>> [1/3] Menambahkan file yang berubah (git add -A)..." -ForegroundColor Yellow
git add -A

$changes = git status --porcelain
if ($changes) {
    Write-Host ">>> [2/3] Melakukan commit dengan pesan: '$Message'..." -ForegroundColor Yellow
    git commit -m "$Message"
} else {
    Write-Host ">>> [2/3] Tidak ada file baru yang perlu di-commit (working tree clean)." -ForegroundColor Gray
}

Write-Host ">>> [3/3] Melakukan push ke origin main..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ">>> SUKSES: Repository berhasil disinkronkan & di-push ke GitHub!" -ForegroundColor Green
} else {
    Write-Host ">>> GAGAL: Terjadi kendala saat push ke GitHub." -ForegroundColor Red
}
