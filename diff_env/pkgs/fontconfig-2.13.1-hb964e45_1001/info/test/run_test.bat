



fc-cache --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-cat --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-list --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-match --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-pattern --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-query --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-scan --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
fc-validate --help
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%/Library/lib/fontconfig.lib exit /b 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
