@echo off
setlocal
set MSG=%~1
if "%MSG%"=="" set MSG=Auto update: %DATE% %TIME%

echo ==========================================
echo  Technotama LMS - Automated Git Push Sync 
echo ==========================================

echo [1/3] Staging changes...
git add -A

echo [2/3] Committing changes...
git commit -m "%MSG%"

echo [3/3] Pushing to origin main...
git push origin main

echo Done!
pause
