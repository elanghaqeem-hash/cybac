@echo off
setlocal
set MSG=%~1
if "%MSG%"=="" set MSG=Auto update: %DATE% %TIME%

echo ==========================================
echo  Technotama LMS - Automated Git Push Sync 
echo ==========================================

echo [1/3] Menambahkan seluruh file...
git add -A

git diff-index --quiet HEAD --
if %errorlevel% neq 0 (
    echo [2/3] Melakukan commit...
    git commit -m "%MSG%"
) else (
    echo [2/3] Working tree bersih, melanjutkan push...
)

echo [3/3] Melakukan push ke origin main...
git push origin main

echo ==========================================
echo Selesai!
pause
