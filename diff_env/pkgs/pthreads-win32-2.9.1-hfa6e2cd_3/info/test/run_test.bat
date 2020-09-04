



if not exist %LIBRARY_INC%\pthread.h exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %LIBRARY_BIN%\pthreadVSE2.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %LIBRARY_LIB%\pthreads.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %LIBRARY_LIB%\pthread.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %LIBRARY_LIB%\pthreads_static.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
