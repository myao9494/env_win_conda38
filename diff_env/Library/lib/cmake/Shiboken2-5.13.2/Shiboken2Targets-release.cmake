#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "Shiboken2::libshiboken" for configuration "Release"
set_property(TARGET Shiboken2::libshiboken APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(Shiboken2::libshiboken PROPERTIES
  IMPORTED_IMPLIB_RELEASE "C:/Users/mineo/Anaconda38/Library/lib/shiboken2.cp38-win_amd64.lib"
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/shiboken2.cp38-win_amd64.dll"
  )

list(APPEND _IMPORT_CHECK_TARGETS Shiboken2::libshiboken )
list(APPEND _IMPORT_CHECK_FILES_FOR_Shiboken2::libshiboken "C:/Users/mineo/Anaconda38/Library/lib/shiboken2.cp38-win_amd64.lib" "${_IMPORT_PREFIX}/bin/shiboken2.cp38-win_amd64.dll" )

# Import target "Shiboken2::shiboken2" for configuration "Release"
set_property(TARGET Shiboken2::shiboken2 APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(Shiboken2::shiboken2 PROPERTIES
  IMPORTED_LOCATION_RELEASE "${_IMPORT_PREFIX}/bin/shiboken2.exe"
  )

list(APPEND _IMPORT_CHECK_TARGETS Shiboken2::shiboken2 )
list(APPEND _IMPORT_CHECK_FILES_FOR_Shiboken2::shiboken2 "${_IMPORT_PREFIX}/bin/shiboken2.exe" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
