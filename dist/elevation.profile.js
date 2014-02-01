(function() {
  var $container, ElevationProfile, container, el, _i, _j, _len, _len1, _ref;

  ElevationProfile = (function() {
    function ElevationProfile($container, data, options) {
      var $area, $bin, $focus, $g, $gmap, $notes, $svg, centerPoint, d, dataByX, dist, drawGooglePath, findTextPlacement, gcoord, hideFocus, intersectRect, isValidPlacement, map, marker, measureText, mousemove, opts, place, placement, placements, point, pointsWithPlaces, probingLocations, putNote, setFocus, showFocus, touchmove, x, xAxis, xd, y, yAxis, yByX, yd, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      opts = options;
      if (opts.height == null) {
        opts.height = 400;
      }
      if (opts.width == null) {
        opts.width = $container.node().offsetWidth;
      }
      if (opts.padding == null) {
        opts.padding = 40;
      }
      if (opts.baseElevation == null) {
        opts.baseElevation = 1500;
      }
      if (opts.extraElevation == null) {
        opts.extraElevation = 500;
      }
      if (opts.gMapZoomLevel == null) {
        opts.gMapZoomLevel = 11;
      }
      data = data.sort(function(a, b) {
        return a.distance - b.distance;
      });
      x = d3.scale.linear().domain([
        0, d3.max(data, function(d) {
          return d.distance;
        })
      ]).range([opts.padding, opts.width]);
      y = d3.scale.linear().domain([
        opts.baseElevation, d3.max(data, function(d) {
          return d.elevation;
        }) + opts.extraElevation
      ]).range([opts.height - opts.padding, opts.padding]);
      xd = function(d) {
        return x(d.distance);
      };
      yd = function(d) {
        return y(d.elevation);
      };
      gcoord = function(coord) {
        return new google.maps.LatLng(coord.lat, +coord.lng);
      };
      drawGooglePath = function(width, color) {
        var d;
        return new google.maps.Polyline({
          path: (function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = data.length; _i < _len; _i++) {
              d = data[_i];
              _results.push(gcoord(d.location));
            }
            return _results;
          })(),
          strokeColor: color,
          strokeOpacity: 1,
          strokeWeight: width,
          map: map
        });
      };
      centerPoint = gcoord(data[data.length / 2].location);
      $gmap = $container.append("div").attr("class", "gmap").style("width", opts.width + "px").style("height", opts.height + "px");
      map = new google.maps.Map($gmap.node(), {
        zoom: opts.gMapZoomLevel,
        center: centerPoint,
        mapTypeId: 'terrain'
      });
      drawGooglePath(6, '#fff');
      drawGooglePath(3, '#600');
      marker = new google.maps.Marker({
        position: centerPoint,
        title: "walk"
      });
      $svg = $container.append("svg:svg").attr("width", opts.width).attr("height", opts.height);
      $g = $svg.append("svg:g");
      xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
      yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
      $svg.append("g").attr("class", "axis").attr("transform", "translate(0," + (opts.height - opts.padding) + ")").call(xAxis).append("text").attr("x", opts.width - 7).attr("y", -7).style("text-anchor", "end").text("km");
      $svg.append("g").attr("class", "axis").attr("transform", "translate(" + opts.padding + ",0)").call(yAxis).append("text").attr("y", opts.padding + 7).attr("x", 15).style("text-anchor", "end").text("m");
      $area = d3.svg.area().x(xd).y0(opts.height - opts.padding).y1(yd);
      $g.append("svg:path").datum(data).attr("d", d3.svg.line().x(xd).y(yd));
      $g.append("path").datum(data).attr("class", "area").attr("d", $area);
      $focus = $g.append("g").attr("class", "focus").style("display", "none");
      $focus.append("line").attr("y1", opts.padding).attr("y2", opts.height - opts.padding);
      $focus.append("line").attr("y1", opts.padding).attr("y2", opts.padding).attr("x2", "50px");
      $focus.append("circle").attr("r", 3);
      $focus.append("text").attr("x", 3).attr("dy", opts.padding - 3);
      showFocus = function() {
        $focus.style("display", null);
        return marker.setMap(map);
      };
      hideFocus = function() {
        $focus.style("display", "none");
        return marker.setMap(null);
      };
      google.maps.event.addListener(map, 'mouseover', showFocus);
      google.maps.event.addListener(map, 'mouseout', hideFocus);
      google.maps.event.addListener(map, 'mousemove', function(event) {
        return setFocus(data.reduce(function(a, b) {
          if (dist(a, event.latLng) > dist(b, event.latLng)) {
            return b;
          } else {
            return a;
          }
        }));
      });
      dist = function(dp, mp) {
        return google.maps.geometry.spherical.computeDistanceBetween(gcoord(dp.location), mp);
      };
      dataByX = function(xVal) {
        var bisect;
        bisect = d3.bisector(function(d) {
          return d.distance;
        }).right;
        return data[bisect(data, x.invert(xVal))];
      };
      yByX = function(xVal) {
        if (xVal < 0 || xVal > opts.width) {
          return 0;
        }
        return y(dataByX(xVal).elevation);
      };
      setFocus = function(d) {
        var loc;
        $focus.attr("transform", "translate(" + x(d.distance) + ",0)");
        $focus.select("text").text(d3.round(d.elevation, 0) + "m");
        $focus.select("circle").attr("transform", "translate(0, " + y(d.elevation) + ")");
        loc = gcoord(d.location);
        return marker.setPosition(loc);
      };
      pointsWithPlaces = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          d = data[_i];
          if (!!d['places']) {
            _results.push(d);
          }
        }
        return _results;
      })();
      $notes = $g.append("g").attr("class", "notes");
      $bin = $svg.append("g").style("display", "none");
      measureText = function(text) {
        var $el, rect;
        $el = $bin.append("text").text(text);
        rect = $el.node().getBBox();
        $el.remove();
        return rect;
      };
      probingLocations = function(point, rect, offset) {
        var loc, xVal, yVal;
        xVal = x(point.distance);
        yVal = yByX(xVal);
        loc = function(xv, yv) {
          return {
            x: xv,
            y: yv,
            rect: rect,
            sx: xVal,
            sy: yVal
          };
        };
        return [loc(xVal - rect.width - offset, yVal - rect.height - offset), loc(xVal + offset, yVal - rect.height - offset), loc(xVal + offset, yVal + offset - rect.height - 5), loc(xVal - rect.width - offset, yVal + offset - rect.height - 5)];
      };
      intersectRect = function(p1, p2) {
        return !(p2.x > p1.x + p1.rect.width || p2.x + p2.rect.width < p1.x || p2.y > p1.y + p1.rect.height || p2.y + p2.rect.height < p1.y);
      };
      placements = [];
      isValidPlacement = function(location, rect) {
        var i, p, _i, _j, _len, _ref, _ref1;
        if (location.x < 0 || location.x + rect.width > opts.width) {
          return false;
        }
        for (_i = 0, _len = placements.length; _i < _len; _i++) {
          p = placements[_i];
          if (intersectRect(p, location)) {
            return false;
          }
        }
        for (i = _j = -10, _ref = rect.width + 10; -10 <= _ref ? _j <= _ref : _j >= _ref; i = -10 <= _ref ? ++_j : --_j) {
          if ((location.y - 5 < (_ref1 = yByX(location.x + i)) && _ref1 < location.y + rect.height + 5)) {
            return false;
          }
        }
        return true;
      };
      findTextPlacement = function(p, text, ignore) {
        var l, locations, offset, rect, _i, _len;
        rect = measureText(text);
        offset = 25;
        locations = probingLocations(p, rect, offset);
        for (_i = 0, _len = locations.length; _i < _len; _i++) {
          l = locations[_i];
          if (isValidPlacement(l, rect)) {
            return l;
          }
        }
        return null;
      };
      putNote = function(placement, place) {
        $notes.append("circle").attr("cx", placement.sx).attr("cy", placement.sy).attr("r", 1);
        $notes.append("text").attr("x", placement.x).attr("y", placement.y + placement.rect.height).text(place.name);
        $notes.append("line").attr("x1", placement.x).attr("x2", placement.x + placement.rect.width).attr("y1", placement.y + placement.rect.height + 5).attr("y2", placement.y + placement.rect.height + 5).style("text-anchor", "start");
        return $notes.append("line").attr("x1", placement.sx).attr("y1", placement.sy).attr("x2", placement.x < placement.sx ? placement.x + placement.rect.width : placement.x).attr("y2", placement.y + placement.rect.height + 5);
      };
      for (_i = 0, _len = pointsWithPlaces.length; _i < _len; _i++) {
        point = pointsWithPlaces[_i];
        _ref = point['places'];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          place = _ref[_j];
          new google.maps.Marker({
            position: gcoord(place.location),
            title: place.name,
            map: map
          });
          placement = findTextPlacement(point, place.name);
          if (placement) {
            placements.push(placement);
            putNote(placement, place);
          } else {
            console.warn("No placement for note '" + place.name + "' found");
          }
        }
      }
      mousemove = function() {
        return setFocus(dataByX(d3.mouse(this)[0]));
      };
      touchmove = function() {
        return setFocus(dataByX(d3.touches(this)[0][0]));
      };
      $g.append("rect").attr("class", "overlay").attr("width", opts.width).attr("height", opts.height - opts.padding).attr("dx", opts.padding).attr("dy", opts.padding).on("mouseover", showFocus).on("mouseout", hideFocus).on("mousemove", mousemove).on("touchstart", showFocus).on("touchmove", touchmove);
    }

    return ElevationProfile;

  })();

  _ref = d3.selectAll("div[data-item='elevation-profile']");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    for (_j = 0, _len1 = el.length; _j < _len1; _j++) {
      container = el[_j];
      $container = d3.select(container);
      d3.json($container.attr('data-src'), function(err, json) {
        var options, opts;
        if (err) {
          return console.warn(error);
        } else {
          opts = $container.attr('data-opts');
          options = opts ? JSON.parse(opts) : {};
          return new ElevationProfile($container, json, options);
        }
      });
    }
  }

}).call(this);

//# sourceMappingURL=../dist/elevation.profile.js.map
