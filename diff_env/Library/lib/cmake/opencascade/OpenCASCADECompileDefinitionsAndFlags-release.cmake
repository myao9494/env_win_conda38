#-----------------------------------------------------------------------------
#
# OpenCASCADECompileDefinitionsAndFlags-release.cmake - OpenCASCADE CMake file 
# with compile definitions and C/C++ flags for Release configuration.
#
# This file is configured by OpenCASCADE.
#

# The C and C++ flags added by OpenCASCADE to the cmake-configured flags.
set (OpenCASCADE_C_FLAGS_RELEASE      "/MD /O2 /Ob2 /DNDEBUG")
set (OpenCASCADE_CXX_FLAGS_RELEASE    "/MD /O2 /Ob2 /DNDEBUG")

# The compile definitions used by OpenCASCADE.
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:UNICODE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:_UNICODE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:_CRT_SECURE_NO_WARNINGS>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:_CRT_NONSTDC_NO_DEPRECATE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:HAVE_VTK>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkDomainsChemistry_AUTOINIT=1\(vtkDomainsChemistryOpenGL2\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkIOExport_AUTOINIT=2\(vtkIOExportOpenGL2,vtkIOExportPDF\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkRenderingContext2D_AUTOINIT=1\(vtkRenderingContextOpenGL2\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkRenderingCore_AUTOINIT=3\(vtkInteractionStyle,vtkRenderingFreeType,vtkRenderingOpenGL2\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkRenderingFreeType_AUTOINIT=1\(vtkRenderingMatplotlib\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkRenderingOpenGL2_AUTOINIT=1\(vtkRenderingGL2PSOpenGL2\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:vtkRenderingVolume_AUTOINIT=1\(vtkRenderingVolumeOpenGL2\)>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:HAVE_FREEIMAGE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:HAVE_TBB>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:__TBB_NO_IMPLICIT_LINKAGE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:__TBBMALLOC_NO_IMPLICIT_LINKAGE>)
set_property(DIRECTORY APPEND PROPERTY COMPILE_DEFINITIONS $<$<CONFIG:Release>:VTK_OPENGL2_BACKEND>)

