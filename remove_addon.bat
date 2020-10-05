@echo off

set minecraft_folder="%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang"
set world_folder="testing"

for /f %%i in ('dir /b *Res') do set resource_folder=%%i
for /f %%i in ('dir /b *Beh') do set behavior_folder=%%i

rem Remove existing resource and behavior packs
<nul set /p ="Removing pack from minecraft... "
rmdir /s /q "%minecraft_folder%\resource_packs\%resource_folder%" > nul 2>&1
rmdir /s /q "%minecraft_folder%\behavior_packs\%behavior_folder%" > nul 2>&1
echo [ OK ]

<nul set /p ="Removing pack from world... "
rmdir /s /q "%minecraft_folder%\minecraftWorlds\%world_folder%\resource_packs\%resource_folder%" > nul 2>&1
rmdir /s /q "%minecraft_folder%\minecraftWorlds\%world_folder%\behavior_packs\%behavior_folder%" > nul 2>&1
echo [ OK ]
