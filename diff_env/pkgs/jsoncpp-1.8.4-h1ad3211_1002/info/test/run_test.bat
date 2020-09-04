



if not exist %PREFIX%\\Library\\include\\json\\json.h exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\jsoncpp.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
