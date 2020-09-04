
#ifndef VTKIOXDMF2_EXPORT_H
#define VTKIOXDMF2_EXPORT_H

#ifdef VTKIOXDMF2_STATIC_DEFINE
#  define VTKIOXDMF2_EXPORT
#  define VTKIOXDMF2_NO_EXPORT
#else
#  ifndef VTKIOXDMF2_EXPORT
#    ifdef vtkIOXdmf2_EXPORTS
        /* We are building this library */
#      define VTKIOXDMF2_EXPORT __declspec(dllexport)
#    else
        /* We are using this library */
#      define VTKIOXDMF2_EXPORT __declspec(dllimport)
#    endif
#  endif

#  ifndef VTKIOXDMF2_NO_EXPORT
#    define VTKIOXDMF2_NO_EXPORT 
#  endif
#endif

#ifndef VTKIOXDMF2_DEPRECATED
#  define VTKIOXDMF2_DEPRECATED __declspec(deprecated)
#  define VTKIOXDMF2_DEPRECATED_EXPORT VTKIOXDMF2_EXPORT __declspec(deprecated)
#  define VTKIOXDMF2_DEPRECATED_NO_EXPORT VTKIOXDMF2_NO_EXPORT __declspec(deprecated)
#endif

#define DEFINE_NO_DEPRECATED 0
#if DEFINE_NO_DEPRECATED
# define VTKIOXDMF2_NO_DEPRECATED
#endif



#endif
