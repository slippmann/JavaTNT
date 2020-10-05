@echo off

set minecraft_folder="%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang"
set world_folder="testing"

for /f %%i in ('dir /b *Res') do set resource_folder=%%i
for /f %%i in ('dir /b *Beh') do set behavior_folder=%%i

call remove_addon.bat

rem Copy the new resource and behavior packs
<nul set /p ="Adding pack to minecraft... "
if not "%resource_folder%"=="" ( xcopy /s /q /i ".\%resource_folder%" "%minecraft_folder%\resource_packs\%resource_folder%" > nul 2>&1 || goto fail )
if not "%behavior_folder%"=="" ( xcopy /s /q /i ".\%behavior_folder%" "%minecraft_folder%\behavior_packs\%behavior_folder%" > nul 2>&1 || goto fail )
echo [ OK ]

<nul set /p ="Adding pack to world folder... "
if not "%resource_folder%"=="" ( xcopy /s /q /i ".\%resource_folder%" "%minecraft_folder%\minecraftWorlds\%world_folder%\resource_packs\%resource_folder%" > nul 2>&1 || goto fail )
if not "%behavior_folder%"=="" ( xcopy /s /q /i ".\%behavior_folder%" "%minecraft_folder%\minecraftWorlds\%world_folder%\behavior_packs\%behavior_folder%" > nul 2>&1 || goto fail )
echo [ OK ]

goto end

:fail
    echo [ FAIL ]

:end
