@echo off
setlocal enabledelayedexpansion

:: Set the directory where the files are located
set "folderPath=C:\path\to\your\directory"

:: Change to the target directory
cd /d "%folderPath%"

:: Loop through each file in the directory
for %%f in (*) do (
    :: Get the filename and extension
    set "filename=%%~nf"
    set "extension=%%~xf"
    
    :: Check if the filename starts with "src_components_"
    if "!filename!" neq "!filename:src_components_=!" (
        set "newName=!filename:src_components_=!"
        ren "%%f" "!newName!!extension!"
    )
    
    :: Check if the filename starts with "src_pages_"
    if "!filename!" neq "!filename:src_pages_=!" (
        set "newName=!filename:src_pages_=!"
        ren "%%f" "!newName!!extension!"
    )
)

echo Process completed.
pause
