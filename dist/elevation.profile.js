//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+c/d*100,g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();{var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});d.radius+d.length+d.width}if(e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});
(function() {
  var ElevationProfile, container, el, initChart, _i, _j, _len, _len1, _ref;

  ElevationProfile = (function() {
    ElevationProfile.prototype.draw = function($container, data, options) {
      var $area, $bin, $focus, $g, $gmap, $notes, $svg, centerPoint, d, dataByX, dist, drawGooglePath, findTextPlacement, gcoord, hideFocus, intersectRect, isValidPlacement, map, marker, measureText, mousemove, notex2, opts, place, placement, placements, point, pointsWithPlaces, probingLocations, putNote, setFocus, showFocus, touchmove, x, xAxis, xd, y, yAxis, yByX, yd, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      opts = options;
      if (opts.height == null) {
        opts.height = 400;
      }
      opts.width = $container.node().offsetWidth;
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
      centerPoint = gcoord(data[Math.floor(data.length / 2)].location);
      $container.selectAll("*").remove();
      $svg = $container.append("svg:svg").attr("width", opts.width).attr("height", opts.height);
      $gmap = $container.append("div").attr("class", "gmap").style("width", opts.width + "px").style("height", opts.height + "px");
      map = new google.maps.Map($gmap.node(), {
        zoom: opts.gMapZoomLevel,
        center: centerPoint,
        scrollwheel: false,
        mapTypeId: 'terrain'
      });
      drawGooglePath(6, '#fff');
      drawGooglePath(3, '#600');
      marker = new google.maps.Marker({
        position: centerPoint,
        title: "walk"
      });
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
        var d;
        if (xVal < 0 || xVal > opts.width) {
          return 0;
        }
        d = dataByX(xVal);
        if (d) {
          return y(d.elevation);
        }
        return 0;
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
      $bin = $svg.append("g");
      notex2 = function(placement) {
        if (placement.x < placement.sx) {
          return placement.x + placement.rect.width;
        } else {
          return placement.x;
        }
      };
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
        var intersect;
        intersect = !(p2.x > p1.x + p1.rect.width || p2.x + p2.rect.width < p1.x || p2.y > p1.y + p1.rect.height || p2.y + p2.rect.height + 10 < p1.y);
        if (intersect) {
          return intersect;
        }
        return (p1.sx < p2.sx) !== (notex2(p1) < notex2(p2));
      };
      placements = [];
      isValidPlacement = function(location, rect) {
        var i, p, _i, _j, _len, _ref, _ref1;
        if (location.x < opts.padding || location.x + rect.width > opts.width) {
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
        offset = 30;
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
        return $notes.append("line").attr("x1", placement.sx).attr("y1", placement.sy).attr("x2", notex2(placement)).attr("y2", placement.y + placement.rect.height + 5);
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
      return $g.append("rect").attr("class", "overlay").attr("width", opts.width).attr("height", opts.height - opts.padding).attr("dx", opts.padding).attr("dy", opts.padding).on("mouseover", showFocus).on("mouseout", hideFocus).on("mousemove", mousemove).on("touchstart", showFocus).on("touchmove", touchmove);
    };

    function ElevationProfile($container, data, options) {
      var _self;
      if (options == null) {
        options = {};
      }
      this.draw($container, data, options);
      _self = this;
      d3.select(window).on('resize', function() {
        return _self.draw($container, data, options);
      });
    }

    return ElevationProfile;

  })();

  initChart = function($container) {
    var opts, spinner;
    opts = {
      lines: 13,
      length: 20,
      width: 10,
      radius: 30,
      corners: 1,
      rotate: 0,
      direction: 1,
      color: "#000",
      speed: 1,
      trail: 60,
      shadow: false,
      hwaccel: false,
      className: "spinner",
      zIndex: 2e9,
      top: "50%",
      left: "50%"
    };
    spinner = new Spinner(opts).spin($container[0][0]);
    return d3.json($container.attr('data-src'), function(err, json) {
      var options;
      spinner.stop();
      if (err) {
        return console.warn(error);
      } else {
        opts = $container.attr('data-opts');
        options = opts ? JSON.parse(opts) : {};
        return new ElevationProfile($container, json, options);
      }
    });
  };

  _ref = d3.selectAll("div[data-item='elevation-profile']");
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    el = _ref[_i];
    for (_j = 0, _len1 = el.length; _j < _len1; _j++) {
      container = el[_j];
      initChart(d3.select(container));
    }
  }

}).call(this);

//# sourceMappingURL=../dist/elevation.profile.js.map
