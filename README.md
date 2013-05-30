I'm having fun playing with [D3.js](http://d3js.org/). 

## About the data
I found my data for US states from [this site](http://eric.clst.org/Stuff/USGeoJSON). I converted them with ogr2ogr and topojson. To install these tools install [gdal](http://trac.osgeo.org/gdal/wiki/DownloadingGdalBinaries) (on a mac `brew install gdal`) and `npm install -g topojson`. 
I found direction from Mike Bostock's [helpful mapping tutorial](http://bost.ocks.org/mike/map/). 
The following should work: `$ ogr2ogr -f GeoJSON states.json foo.shp ; topojson --id-property su_a3 -p name=NAME -p name -o usa.json state.json` where `foo.shp` indicates a shapefile.