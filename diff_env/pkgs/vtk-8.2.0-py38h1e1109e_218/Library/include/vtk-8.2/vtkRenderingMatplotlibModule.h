
#ifndef VTKRENDERINGMATPLOTLIB_EXPORT_H
#define VTKRENDERINGMATPLOTLIB_EXPORT_H

#ifdef VTKRENDERINGMATPLOTLIB_STATIC_DEFINE
#  define VTKRENDERINGMATPLOTLIB_EXPORT
#  define VTKRENDERINGMATPLOTLIB_NO_EXPORT
#else
#  ifndef VTKRENDERINGMATPLOTLIB_EXPORT
#    ifdef vtkRenderingMatplotlib_EXPORTS
        /* We are building this library */
#      define VTKRENDERINGMATPLOTLIB_EXPORT __declspec(dllexport)
#    else
        /* We are using this library */
#      define VTKRENDERINGMATPLOTLIB_EXPORT __declspec(dllimport)
#    endif
#  endif

#  ifndef VTKRENDERINGMATPLOTLIB_NO_EXPORT
#    define VTKRENDERINGMATPLOTLIB_NO_EXPORT 
#  endif
#endif

#ifndef VTKRENDERINGMATPLOTLIB_DEPRECATED
#  define VTKRENDERINGMATPLOTLIB_DEPRECATED __declspec(deprecated)
#  define VTKRENDERINGMATPLOTLIB_DEPRECATED_EXPORT VTKRENDERINGMATPLOTLIB_EXPORT __declspec(deprecated)
#  define VTKRENDERINGMATPLOTLIB_DEPRECATED_NO_EXPORT VTKRENDERINGMATPLOTLIB_NO_EXPORT __declspec(deprecated)
#endif

#define DEFINE_NO_DEPRECATED 0
#if DEFINE_NO_DEPRECATED
# define VTKRENDERINGMATPLOTLIB_NO_DEPRECATED
#endif

/* AutoInit dependencies.  */
#include "vtkRenderingFreeTypeModule.h"
#include "vtkRenderingFreeTypeModule.h"

/* AutoInit implementations.  */
#if defined(vtkRenderingMatplotlib_INCLUDE)
# include vtkRenderingMatplotlib_INCLUDE
#endif
#if defined(vtkRenderingMatplotlib_AUTOINIT)
# include "vtkAutoInit.h"
VTK_AUTOINIT(vtkRenderingMatplotlib)
#endif

#endif
