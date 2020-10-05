@echo off

for %%i in (.) do set addon_name=%%~nxi

rem Remove existing package
<nul set /p ="Removing existing addon... "
del %addon_name%.mcaddon > nul 2>&1 || goto fail
echo [ OK ]

rem Zip the folders
<nul set /p ="Zipping... "
"C:\Program Files\WinRAR\WinRAR.exe" a -r %addon_name%.zip %addon_name%Res %addon_name%Beh > nul 2>&1 || goto fail
echo [ OK ]

rem Rename to *.mcaddon
<nul set /p ="Converting to addon... "
move %addon_name%.zip %addon_name%.mcaddon > nul 2>&1 || goto fail
echo [ OK ]

goto end

:fail
    echo [ FAIL ]

:end
