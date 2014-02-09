elevation-profile
=================

Elevation profile visualization from KML file.
Live example in my blog [here](http://gaziga.com/himalayan-trails/)

##Usage

1. Load elevation data for path from kml file
`bundle exec ruby kml_converter.rb input.kml output.json`
kml file must contain one route and place marks along the route ([sample kml](http://gaziga.com/himalayan-trails/tilicho_ru.kml))

2. Add tag and scripts to your page
`<div data-item="elevation-profile" data-src="output.json" data-opts='{"extraElevation": 500}'></div>`    
examples: [here](https://github.com/gagarych/elevation-profile/blob/master/example.html) and [there](http://gaziga.com/himalayan-trails/)

##Options

Pass JSON object string to `data-opts` attribute.

* height          - height of chart. *default: 400*
* width           - width of chart. *default: 100%*
* padding         - padding. *default: 40*
* baseElevation   - lowest elevation level in meters. *default: 1500*
* extraElevation  - extra elevation to add above highest point in meters. *default: 500*
* gMapZoomLevel   - google map zoom level, higher is closer. *default: 11*