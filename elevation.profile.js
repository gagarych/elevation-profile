(function () {
    ElevationProfile = function (container, data, opts) {
        opts = opts || {};
        opts.height = opts.height || 400;
        opts.padding = opts.padding || 40;
        opts.width = opts.width || container.node().offsetWidth;
        opts.baseElevation = opts.baseElevation || 1500;
        opts.extraElevation = opts.extraElevation || 500;
        opts.gMapZoomLevel = opts.gMapZoomLevel || 11;

        data = data.sort(function (a, b) {
            return a.distance - b.distance;
        });

        var x = d3.scale.linear().domain([0, d3.max(data, function (d) {
                return d.distance;
            })]).range([opts.padding, opts.width]),

            y = d3.scale.linear().domain([opts.baseElevation, d3.max(data, function (d) {
                return d.elevation;
            }) + opts.extraElevation]).range([opts.height - opts.padding, opts.padding]);


        function gcoord(coord) {
            return new google.maps.LatLng(coord.lat, coord.lng);
        }

        var centerPoint = gcoord(data[data.length / 2].location);

        function drawGooglePath(width, color) {
            return new google.maps.Polyline({
                path: data.map(function (p) {
                    return gcoord(p.location);
                }),
                strokeColor: color,
                strokeOpacity: 1,
                strokeWeight: width,
                map: map
            });
        }

        var $gmap = container.append("div").attr("class", "gmap").style("width", opts.width + "px").style("height", opts.height + "px");

        var map = new google.maps.Map($gmap.node(), {
            zoom: opts.gMapZoomLevel,
            center: centerPoint,
            mapTypeId: 'terrain'
        });

        drawGooglePath(6, '#fff');
        drawGooglePath(3, '#600');

        var marker = new google.maps.Marker({
            position: centerPoint,
            title: "walk"
        });

        var $svg = container.append("svg:svg")
            .attr("width", opts.width)
            .attr("height", opts.height);

        var $g = $svg.append("svg:g");

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        $svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (opts.height - opts.padding) + ")")
            .call(xAxis)
            .append("text")
            .attr("x", opts.width - 7)
            .attr("y", -7)
            .style("text-anchor", "end")
            .text("km");

        $svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + opts.padding + ",0)")
            .call(yAxis)
            .append("text")
            .attr("y", opts.padding + 7)
            .attr("x", 15)
            .style("text-anchor", "end")
            .text("m");

        var $area = d3.svg.area()
            .x(function (d) {
                return x(d.distance);
            })
            .y0(opts.height - opts.padding)
            .y1(function (d) {
                return y(d.elevation);
            });

        var $path = $g.append("svg:path").attr("d", $area(data));

        $g.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", $area);

        var $focus = $g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        $focus.append("line")
            .attr("y1", opts.padding)
            .attr("y2", opts.height - opts.padding);

        $focus.append("line")
            .attr("y1", opts.padding)
            .attr("y2", opts.padding)
            .attr("x2", "50px");

        $focus.append("circle")
            .attr("r", 3)

        $focus.append("text")
            .attr("x", 3)
            .attr("dy", opts.padding - 3);

        function showFocus() {
            $focus.style("display", null);
            marker.setMap(map);
        }

        function hideFocus() {
            $focus.style("display", "none");
            marker.setMap(null);
        }


        google.maps.event.addListener(map, 'mouseover', showFocus);

        google.maps.event.addListener(map, 'mouseout', hideFocus);

        google.maps.event.addListener(map, 'mousemove', function (event) {
            var cur = data[0];
            var curDist = null;
            data.forEach(function (d) {
                var distance = dist(d, event.latLng);
                if (curDist == null || curDist > distance) {
                    curDist = distance;
                    cur = d;
                }
            });
            setFocus(cur);
        });

        function dist(dp, mp) {
            return google.maps.geometry.spherical.computeDistanceBetween(gcoord(dp.location), mp);
        }

        function dataByX(xVal) {
            var bisect = d3.bisector(function (d) {
                return d.distance;
            }).right;
            return data[bisect(data, x.invert(xVal))];
        }

        function yByX(xVal) {
            if (xVal < 0 || xVal > opts.width) {
                return 0;
            }
            return y(dataByX(xVal).elevation);
        }

        function setFocus(d) {
            if (d) {
                $focus.attr("transform", "translate(" + x(d.distance) + ",0)");
                $focus.select("text").text(d3.round(d.elevation, 0) + "m");
                $focus.select("circle").attr("transform", "translate(0, " + y(d.elevation) + ")");
                var loc = gcoord(d.location);
                marker.setPosition(loc);
            }
        }

        function mousemove() {
            setFocus(dataByX(d3.mouse(this)[0]));
        }

        function touchmove() {
            setFocus(dataByX(d3.touches(this)[0][0]));
        }


        var pointsWithPlaces = data.filter(function (d) {
            return !!d['places'];
        });

        var $notes = $g.append("g").attr("class", "notes");

        var $bin = $svg.append("g").style("display", "none");

        function measureText(text) {
            var $el = $bin.append("text").text(text);
            var rect = $el.node().getBBox();
            $el.remove();
            return rect;
        }


        function probingLocations(point, rect, offset) {
            var xVal = x(point.distance),
                yVal = yByX(xVal);

            function loc(x, y) {
                return {x: x, y: y, rect: rect, sx: xVal, sy: yVal};
            }

            return [
                loc(xVal - rect.width - offset, yVal - rect.height - offset),
                loc(xVal + offset, yVal - rect.height - offset),
                loc(xVal + offset, yVal + offset - rect.height - 5),
                loc(xVal - rect.width - offset, yVal + offset - rect.height - 5),
            ]
        }

        function intersectRect(p1, p2) {
            return !(p2.x > p1.x + p1.rect.width ||
                p2.x + p2.rect.width < p1.x ||
                p2.y > p1.y + p1.rect.height ||
                p2.y + p2.rect.height < p1.y);
        }

        function isValidPlacement(location, rect) {
            if (location.x < 0 || location.x + rect.width > opts.width) {
                return false;
            }

            for (var i = 0; i < placements.length; i++) {
                if (intersectRect(placements[i], location)) {
                    return false;
                }
            }

            for (var i = -10; i < rect.width+10; i++) {
                var fx = yByX(location.x + i);
                if (location.y - 5 <= fx && fx <= location.y + rect.height + 5) {
                    return false;
                }
            }


            return true;
        }

        function findTextPlacement(p, text, ignore) {
            var rect = measureText(text),
                offset = 25;

            var locations = probingLocations(p, rect, offset);
            for (var i = 0; i < locations.length; i++) {
                if (isValidPlacement(locations[i], rect)) {
                    return locations[i];
                }
            }
            return null;
        }

        function putNote(placement, point, place) {

            $notes.append("circle")
                .attr("cx", placement.sx)
                .attr("cy", placement.sy)
                .attr("r", 1);

            $notes.append("text")
                .attr("x", placement.x)
                .attr("y", placement.y + placement.rect.height)
                .text(place.name);

            $notes.append("line")
                .attr("x1", placement.x)
                .attr("x2", placement.x + placement.rect.width)
                .attr("y1", placement.y + placement.rect.height + 5)
                .attr("y2", placement.y + placement.rect.height + 5)
                .style("text-anchor", "start");

            $notes.append("line")
                .attr("x1", placement.sx)
                .attr("y1", placement.sy)
                .attr("x2", placement.x < placement.sx ? placement.x + placement.rect.width : placement.x)
                .attr("y2", placement.y + placement.rect.height + 5);

        }

        var placements = [];

        pointsWithPlaces.forEach(function (point) {
            point['places'].forEach(function (place) {
                if (place.name) {
                    var placement = findTextPlacement(point, place.name);
                    if (placement) {
                        placements.push(placement);
                        putNote(placement, point, place);
                    } else {

                    }
                }
            });
        });

        $g.append("rect")
            .attr("class", "overlay")
            .attr("width", opts.width)
            .attr("height", opts.height - opts.padding)
            .attr("dx", opts.padding)
            .attr("dy", opts.padding)
            .on("mouseover", showFocus)
            .on("mouseout", hideFocus)
            .on("mousemove", mousemove)
            .on("touchstart", showFocus)
            .on("touchmove", touchmove);
    };
}());

d3.selectAll("div[data-item='elevation-profile']").forEach(function (el) {
    el.forEach(function (container) {
        var $container = d3.select(container);
        d3.json($container.attr('data-src'), function (error, json) {
            if (error) {
                return console.warn(error);
            }
            else {
                var options = {};
                var opts = $container.attr('data-opts');
                if (opts) {
                    options = JSON.parse(opts);
                }
                new ElevationProfile($container, json, options);
            }
        });
    });
});
