module Jekyll
  module Drops
    class SiteDrop < Drop
      def_delegators :@obj, :photo_galleries, :photos, :photo_tags
    end
  end
  class Site
    attr_accessor :photo_galleries, :photos, :photo_tags
    alias_method :reset_without_galleries, :reset
    def reset
      reset_without_galleries
      self.photos = []
      self.photo_galleries = {}
      self.photo_tags = {}
    end
    
  end
  class GalleryGeneratory < Generator
    safe true

    def generate(site)
      image_data_dir = File.join(site.source, "_assets/image_data")
      # Load up all of the image data
      if Dir.exists?(image_data_dir)
        Dir.foreach(image_data_dir).each do |fname|
          next if File.directory?(fname)
          File.open(File.join(image_data_dir, fname)) do |file|
            file_contents = file.read
            begin
              image_data = JSON.parse(file_contents)
              site.photos << image_data
              tags = image_data["tags"]
              if tags && !tags.empty?
                tags.split(',').each do |t|
                  t_name = t.strip
                  site.photo_tags[t_name] ||= []
                  site.photo_tags[t_name] << image_data
                end
              end
              # Do same with galleries
              #rescue
            end
          end
        end
      end
    end
  end
end