



djpeg -dct int -ppm -outfile testout.ppm testorig.jpg
IF %ERRORLEVEL% NEQ 0 exit /B 1
exit /B 0
