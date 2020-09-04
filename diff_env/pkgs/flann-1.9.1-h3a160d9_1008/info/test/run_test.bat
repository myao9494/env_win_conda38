



if not exist %PREFIX%\\Library\\bin\\flann_cpp.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\flann_cpp.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\flann_cpp_s.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\bin\\flann.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\flann.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\flann_s.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\include\\flann exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
