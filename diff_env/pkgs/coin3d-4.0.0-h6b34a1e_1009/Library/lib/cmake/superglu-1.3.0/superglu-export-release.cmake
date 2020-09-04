#----------------------------------------------------------------
# Generated CMake target import file for configuration "Release".
#----------------------------------------------------------------

# Commands may need to know the format version.
set(CMAKE_IMPORT_FILE_VERSION 1)

# Import target "superglu::GLU" for configuration "Release"
set_property(TARGET superglu::GLU APPEND PROPERTY IMPORTED_CONFIGURATIONS RELEASE)
set_target_properties(superglu::GLU PROPERTIES
  IMPORTED_LINK_INTERFACE_LANGUAGES_RELEASE "C;CXX"
  IMPORTED_LOCATION_RELEASE "D:/bld/coin3d_1597123955731/_h_env/Library/lib/GLUs.lib"
  )

list(APPEND _IMPORT_CHECK_TARGETS superglu::GLU )
list(APPEND _IMPORT_CHECK_FILES_FOR_superglu::GLU "D:/bld/coin3d_1597123955731/_h_env/Library/lib/GLUs.lib" )

# Commands beyond this point should not need to know the version.
set(CMAKE_IMPORT_FILE_VERSION)
