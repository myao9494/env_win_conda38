# - Config file for the SMESH package
# It defines the following variables
#  SMESH_INCLUDE_PATH - include directory for SMESH
#  SMESH_LIB_PATH - path to SMESH libraries
#  SMESH_LIBRARIES - Available SMESH libraries

get_filename_component(SELF_DIR "${CMAKE_CURRENT_LIST_FILE}" PATH)

set(SMESH_INCLUDE_PATH "${SELF_DIR}/../include/smesh")
set(SMESH_LIB_PATH "${SELF_DIR}/../lib")
set(SMESH_LIBRARIES Driver;DriverDAT;DriverGMF;DriverSTL;DriverUNV;MEFISTO2;SMDS;SMESH;SMESHBasics;SMESHControls;SMESHDS;SMESHMisc;SMESHTrace;SMESHUtils;StdMeshers;NETGENPlugin)
set(SMESH_VERSION_MAJOR 8)
set(SMESH_VERSION_MINOR 3)
set(SMESH_VERSION_PATCH 0)
set(SMESH_VERSION_TWEAK 3)
