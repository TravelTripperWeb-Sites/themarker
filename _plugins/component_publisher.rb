TEMPLATE_DIR = '_jekyll_includes' 
Jekyll::Hooks.register :site, :after_reset do |site|
  site.config['keep_files'] ||= []
  site.config['keep_files'] << TEMPLATE_DIR unless site.config['keep_files'].include?(TEMPLATE_DIR)

  p site.config['keep_files']
end

module Jekyll
  class ComponentPublisher < Generator
    def generate(site)
      system("mkdir -p #{site.config['destination']}");

      root = site.config['source']
      
      dirs = [site.config['includes_dir']].flatten

      unless ENV["JEKYLL_ENV"] == 'production'
      # Sync components - TODO do this for all configured includes paths
        dirs.reverse.each do |dir|
          includes_path = "#{site.config['destination']}/#{TEMPLATE_DIR}/"
          system "mkdir -p #{includes_path}/"
          source_path = File.join(root, dir)
          if Dir.exists?(source_path)
            system("rsync --archive #{source_path}/ #{includes_path}")
          end
        end      
      end
    end
  end
end
