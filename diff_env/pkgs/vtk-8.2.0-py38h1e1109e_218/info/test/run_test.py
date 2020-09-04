#  tests for vtk-8.2.0-py38h1e1109e_218 (this is a generated file);
print('===== testing package: vtk-8.2.0-py38h1e1109e_218 =====');
print('running run_test.py');
#  --- run_test.py (begin) ---
import pkg_resources
import vtk
import sys

# If this fails it raises a DistributionNotFound exception
pkg_resources.get_distribution('vtk')

if sys.platform != 'darwin':
  # Linux and Windows can't run these tests on headless nodes, and OSX
  # is where the problem was happening anyway
  sys.exit(0)
  
# test libpng, since this was causing trouble in OSX previously
source = vtk.vtkCubeSource()

mapper = vtk.vtkPolyDataMapper()
mapper.SetInputConnection(source.GetOutputPort())

actor = vtk.vtkActor()
actor.SetMapper(mapper)

renderer = vtk.vtkRenderer()
renderer.AddActor(actor)

window = vtk.vtkRenderWindow()
window.AddRenderer(renderer)
window.SetSize(500, 500)
window.Render()

window_filter = vtk.vtkWindowToImageFilter()
window_filter.SetInput(window)
window_filter.Update()

writer = vtk.vtkPNGWriter()
writer.SetFileName('cube.png')
writer.SetInputData(window_filter.GetOutput())
writer.Write()
#  --- run_test.py (end) ---

print('===== vtk-8.2.0-py38h1e1109e_218 OK =====');
print("import: 'vtk'")
import vtk

print("import: 'vtk.vtkChartsCore'")
import vtk.vtkChartsCore

print("import: 'vtk.vtkCommonCore'")
import vtk.vtkCommonCore

print("import: 'vtk.vtkFiltersCore'")
import vtk.vtkFiltersCore

print("import: 'vtk.vtkFiltersGeneric'")
import vtk.vtkFiltersGeneric

print("import: 'vtk.vtkGeovisCore'")
import vtk.vtkGeovisCore

print("import: 'vtk.vtkFiltersHybrid'")
import vtk.vtkFiltersHybrid

print("import: 'vtk.vtkIOCore'")
import vtk.vtkIOCore

print("import: 'vtk.vtkImagingCore'")
import vtk.vtkImagingCore

print("import: 'vtk.vtkInfovisCore'")
import vtk.vtkInfovisCore

print("import: 'vtk.vtkRenderingCore'")
import vtk.vtkRenderingCore

print("import: 'vtk.vtkViewsCore'")
import vtk.vtkViewsCore

print("import: 'vtk.vtkRenderingVolume'")
import vtk.vtkRenderingVolume

print("import: 'vtk.vtkInteractionWidgets'")
import vtk.vtkInteractionWidgets

print("import: 'vtk.vtkWebGLExporter'")
import vtk.vtkWebGLExporter

print("import: 'vtkmodules'")
import vtkmodules

print("import: 'vtkmodules.vtkChartsCore'")
import vtkmodules.vtkChartsCore

print("import: 'vtkmodules.vtkCommonCore'")
import vtkmodules.vtkCommonCore

print("import: 'vtkmodules.vtkFiltersCore'")
import vtkmodules.vtkFiltersCore

print("import: 'vtkmodules.vtkFiltersGeneric'")
import vtkmodules.vtkFiltersGeneric

print("import: 'vtkmodules.vtkGeovisCore'")
import vtkmodules.vtkGeovisCore

print("import: 'vtkmodules.vtkFiltersHybrid'")
import vtkmodules.vtkFiltersHybrid

print("import: 'vtkmodules.vtkIOCore'")
import vtkmodules.vtkIOCore

print("import: 'vtkmodules.vtkImagingCore'")
import vtkmodules.vtkImagingCore

print("import: 'vtkmodules.vtkInfovisCore'")
import vtkmodules.vtkInfovisCore

print("import: 'vtkmodules.vtkRenderingCore'")
import vtkmodules.vtkRenderingCore

print("import: 'vtkmodules.vtkViewsCore'")
import vtkmodules.vtkViewsCore

print("import: 'vtkmodules.vtkRenderingVolume'")
import vtkmodules.vtkRenderingVolume

print("import: 'vtkmodules.vtkInteractionWidgets'")
import vtkmodules.vtkInteractionWidgets

