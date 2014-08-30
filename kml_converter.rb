require 'nokogiri'
require 'rest_client'
require 'json'
require 'geo-distance'

class KmlConverter
  def request_elevation(params)
    params[:sensor] = false
    return JSON.parse(RestClient.get('http://maps.googleapis.com/maps/api/elevation/json', {:params => params}))
  end

  def get_elevations_path(path, total_dist)
    part_dist = calc_distance path
    pathParam = path.map { |l| "#{l[1]},#{l[0]}" }.join('|')
    return request_elevation({:path => pathParam, :samples => (500 * part_dist / total_dist).ceil})
  end

  def get_elevations(path)
    total_dist = calc_distance path
    path.each_slice(40).map { |s| get_elevations_path(s, total_dist)["results"] }.flatten(1)
  end


  def kmlToPath(kml)
    file = File.read(kml)
    xml = Nokogiri::XML(file)
    placemarks = xml.css('Placemark')

    coords_node = xml.css("LineString coordinates").first
    path_coords = coords_node.text.strip.split(' ').map { |el| el.split(',') }
    path = get_elevations(path_coords) #["results"]
    calc_distance path
    places = placemarks.select { |p| p.at_css('Point') }
    points = []

    places.each do |place|
      coords = place.css('Point').text.split(/[,\n]/).map(&:strip).reject(&:empty?);

      points << {
          'location' => {
              'lat' => coords[2].to_f,
              'lng' => coords[1].to_f
          },
          'name' => place.css('name').text,
          'features' => place.css('description').text.gsub('features:', '').strip.split(',').map(&:strip)
      }
    end
    points.each { |p| settle_point(path, p) }
    path
  end

  def settle_point(path, p)
    cur_node = path.first
    cur_node_dist = -1
    path.each do |node|
      distance = dist(node, p)
      if cur_node_dist == -1 || cur_node_dist > distance
        cur_node = node
        cur_node_dist = distance
      end
    end
    cur_node['places'] = [] if !cur_node.has_key?('places')
    cur_node['places'] << p
  end

  def dist(p1, p2)
    GeoDistance.distance(to_coord(p1), to_coord(p2))
  end

  def calc_distance(path)
    prev = nil
    prev_dist = 0
    path.each do |p|
      if prev.nil?
        p['distance'] = 0 unless p.kind_of?(Array)
      else
        prev_dist = prev_dist + dist(prev, p)
        p['distance'] = prev_dist unless p.kind_of?(Array)
      end
      prev = p
    end
    prev_dist
  end

  def process(kml)
    kmlToPath(kml).to_json
  end

  def to_coord(path_el)
    if path_el.kind_of?(Array)
      [path_el[0], path_el[1]]
    else
      loc = path_el["location"]
      [loc['lat'], loc['lng']]
    end
  end
end

ARGV[1] = "#{ File.basename(ARGV[0], '.kml') }.json" unless ARGV[1]
File.write(ARGV[1], KmlConverter.new.process(ARGV[0]))