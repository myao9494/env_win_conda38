



if not exist %PREFIX%\\Library\\lib\\qhullcpp.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\qhullstatic.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\qhullstatic_r.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\qhull.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\bin\\qhull.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\qhull_r.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\bin\\qhull_r.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\lib\\qhull_p.lib exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
if not exist %PREFIX%\\Library\\bin\\qhull_p.dll exit 1
IF %ERRORLEVEL% NEQ 0 exit /B 1
rbox c P0 D2 | qvoronoi s o
IF %ERRORLEVEL% NEQ 0 exit /B 1
rbox c | qconvex FQ FV n | qhalf Fp
IF %ERRORLEVEL% NEQ 0 exit /B 1
rbox 1000 D3 | qhull C-1e-4 FO Ts
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
