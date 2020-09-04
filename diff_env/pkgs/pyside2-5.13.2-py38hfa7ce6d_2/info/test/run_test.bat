



shiboken2 --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
pyside2-lupdate -help
IF %ERRORLEVEL% NEQ 0 exit /B 1
pyside2-rcc -help
IF %ERRORLEVEL% NEQ 0 exit /B 1
pyside2-uic -help
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
