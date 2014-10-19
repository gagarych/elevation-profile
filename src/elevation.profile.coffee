class ElevationProfile
  draw: ($container, data, options = {}) ->
    opts = options
    opts.height ?= 400
    opts.width = $container.node().offsetWidth
    opts.padding ?= 40
    opts.baseElevation ?= 1500
    opts.extraElevation ?= 500
    opts.gMapZoomLevel ?= 11

    data = data.sort (a, b) ->
      a.distance - b.distance

    x = d3.scale.linear().domain([0, d3.max(data, (d) ->
      d.distance)]).range([opts.padding, opts.width])
    y = d3.scale.linear().domain([opts.baseElevation, d3.max(data, (d) ->
      d.elevation) + opts.extraElevation]).range([opts.height - opts.padding, opts.padding])

    xd = (d) ->
      x(d.distance)
    yd = (d) ->
      y(d.elevation)

    gcoord = (coord) ->
      new google.maps.LatLng(coord.lat, +coord.lng)

    drawGooglePath = (width, color) ->
      new google.maps.Polyline({
        path: (gcoord(d.location) for d in data),
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: width,
        map: map});

    centerPoint = gcoord(data[data.length // 2].location)
    $container.selectAll("*").remove()
    $svg = $container.append("svg:svg").attr("width", opts.width).attr("height", opts.height)

    $gmap = $container.append("div").attr("class", "gmap").style("width", opts.width + "px").style("height",
      opts.height + "px")

    map = new google.maps.Map($gmap.node(), {
      zoom: opts.gMapZoomLevel
      center: centerPoint
      scrollwheel: false
      mapTypeId: 'terrain'
    })

    drawGooglePath(6, '#fff')
    drawGooglePath(3, '#600')

    marker = new google.maps.Marker({
      position: centerPoint,
      title: "walk"
    })

    $g = $svg.append("svg:g")

    xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10);

    yAxis = d3.svg.axis()
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


    $area = d3.svg.area()
    .x(xd)
    .y0(opts.height - opts.padding)
    .y1(yd);

    $g.append("svg:path").datum(data).attr("d", d3.svg.line().x(xd).y(yd));

    $g.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", $area);

    $focus = $g.append("g")
    .attr("class", "focus")
    .style("display", "none");

    $focus.append("line")
    .attr("y1", opts.padding)
    .attr("y2", opts.height - opts.padding)

    $focus.append("line")
    .attr("y1", opts.padding)
    .attr("y2", opts.padding)
    .attr("x2", "50px")

    $focus.append("circle").attr("r", 3)

    $focus.append("text")
    .attr("x", 3)
    .attr("dy", opts.padding - 3)

    showFocus = ->
      $focus.style("display", null)
      marker.setMap(map)

    hideFocus = ->
      $focus.style("display", "none")
      marker.setMap(null)

    google.maps.event.addListener(map, 'mouseover', showFocus)
    google.maps.event.addListener(map, 'mouseout', hideFocus)
    google.maps.event.addListener(map, 'mousemove', (event) ->
      setFocus(data.reduce (a, b) -> if dist(a, event.latLng) > dist(b, event.latLng) then b else a))

    dist = (dp, mp) ->
      google.maps.geometry.spherical.computeDistanceBetween(gcoord(dp.location), mp)
    dataByX = (xVal) ->
      bisect = d3.bisector((d) ->
        d.distance).right
      return data[bisect(data, x.invert(xVal))]

    yByX = (xVal) ->
      return 0 if xVal < 0 || xVal > opts.width
      d = dataByX(xVal)
      return y(d.elevation) if d
      return 0

    setFocus = (d) ->
      $focus.attr("transform", "translate(" + x(d.distance) + ",0)")
      $focus.select("text").text(d3.round(d.elevation, 0) + "m")
      $focus.select("circle").attr("transform", "translate(0, " + y(d.elevation) + ")")
      loc = gcoord(d.location)
      marker.setPosition(loc)


    pointsWithPlaces = (d for d in data when !!d['places'])
    $notes = $g.append("g").attr("class", "notes");
    $bin = $svg.append("g");

    notex2 = (placement) ->
      if placement.x < placement.sx then placement.x + placement.rect.width else placement.x

    measureText = (text) ->
      $el = $bin.append("text").text(text)
      rect = $el.node().getBBox()
      $el.remove()
      return rect

    probingLocations = (point, rect, offset) ->
      xVal = x(point.distance)
      yVal = yByX(xVal)
      loc = (xv, yv) ->
        {x: xv, y: yv, rect: rect, sx: xVal, sy: yVal}
      return [
        loc(xVal - rect.width - offset, yVal - rect.height - offset),
        loc(xVal + offset, yVal - rect.height - offset),
        loc(xVal + offset, yVal + offset - rect.height - 5),
        loc(xVal - rect.width - offset, yVal + offset - rect.height - 5)
      ]

    intersectRect = (p1, p2) ->
      intersect = !(p2.x > p1.x + p1.rect.width ||
      p2.x + p2.rect.width < p1.x ||
      p2.y > p1.y + p1.rect.height ||
      p2.y + p2.rect.height + 10 < p1.y)
      return intersect if intersect
      return (p1.sx < p2.sx) != (notex2(p1) < notex2(p2))

    placements = []

    isValidPlacement = (location, rect) ->
      return false if location.x < opts.padding || location.x + rect.width > opts.width
      return false for p in placements when intersectRect(p, location)
      return false for i in [-10..rect.width + 10] when location.y - 5 < yByX(location.x + i) < location.y + rect.height + 5

      return true

    findTextPlacement = (p, text, ignore) ->
      rect = measureText(text)
      offset = 30
      locations = probingLocations(p, rect, offset)
      return l for l in locations when isValidPlacement(l, rect)
      return null

    putNote = (placement, place) ->
      $notes.append("circle")
      .attr("cx", placement.sx)
      .attr("cy", placement.sy)
      .attr("r", 1)

      $notes.append("text")
      .attr("x", placement.x)
      .attr("y", placement.y + placement.rect.height)
      .text(place.name)

      $notes.append("line")
      .attr("x1", placement.x)
      .attr("x2", placement.x + placement.rect.width)
      .attr("y1", placement.y + placement.rect.height + 5)
      .attr("y2", placement.y + placement.rect.height + 5)
      .style("text-anchor", "start")

      $notes.append("line")
      .attr("x1", placement.sx)
      .attr("y1", placement.sy)
      .attr("x2", notex2(placement))
      .attr("y2", placement.y + placement.rect.height + 5)


    for point in pointsWithPlaces
      for place in point['places']
        new google.maps.Marker({
          position: gcoord(place.location),
          title: place.name,
          map: map
        })
        placement = findTextPlacement(point, place.name)
        if (placement)
          placements.push(placement);
          putNote(placement, place);
        else
          console.warn("No placement for note '" + place.name + "' found");

    mousemove = ->
      setFocus(dataByX(d3.mouse(this)[0]))
    touchmove = ->
      setFocus(dataByX(d3.touches(this)[0][0]))

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
    .on("touchmove", touchmove)

  constructor: ($container, data, options = {}) ->
   this.draw($container, data, options)
   _self = this

   d3.select(window).on('resize', ->
    _self.draw($container, data, options));

initChart = ($container) ->

  opts =
    lines: 13 # The number of lines to draw
    length: 20 # The length of each line
    width: 10 # The line thickness
    radius: 30 # The radius of the inner circle
    corners: 1 # Corner roundness (0..1)
    rotate: 0 # The rotation offset
    direction: 1 # 1: clockwise, -1: counterclockwise
    color: "#000" # #rgb or #rrggbb or array of colors
    speed: 1 # Rounds per second
    trail: 60 # Afterglow percentage
    shadow: false # Whether to render a shadow
    hwaccel: false # Whether to use hardware acceleration
    className: "spinner" # The CSS class to assign to the spinner
    zIndex: 2e9 # The z-index (defaults to 2000000000)
    top: "50%" # Top position relative to parent
    left: "50%" # Left position relative to parent

  spinner = new Spinner(opts).spin($container[0][0])

  d3.json($container.attr('data-src'), (err, json) ->
    spinner.stop()
    if (err)
      console.warn(error)
    else
      opts = $container.attr('data-opts')
      options = if opts then JSON.parse(opts) else {}
      new ElevationProfile($container, json, options)
  )

for el in d3.selectAll("div[data-item='elevation-profile']")
  for container in el
    initChart(d3.select(container))

