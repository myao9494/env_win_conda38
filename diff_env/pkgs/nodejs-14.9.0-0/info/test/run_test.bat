



node -h
IF %ERRORLEVEL% NEQ 0 exit /B 1
node -v
IF %ERRORLEVEL% NEQ 0 exit /B 1
npm version
IF %ERRORLEVEL% NEQ 0 exit /B 1
npm install -h
IF %ERRORLEVEL% NEQ 0 exit /B 1
npm config get prefix -g
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
