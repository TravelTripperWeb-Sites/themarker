module Jekyll
  module CmsRegionMethods
    def process_params(params)
      kv_params = {}
      params.each do |kvstr|
        kv_arr = kvstr.to_s.strip.split(':')
        kv_params[kv_arr[0].strip] = kv_arr[1].to_s.strip
      end
      return kv_params
    end

    def region_name
      @region_name
    end

    def filename
      @filename ||= region_name + '.json'
    end

    def render(context)
      site = context.registers[:site]
      site.data['regions'] ||= []
      page_folder = context['page']['path']
      
      # include_data_path = File.join(root_path, site.config['includes_dir'], '_regions')

      region_items = read_data_json_from(context)
      raise "Array is expected in #{filename}, but #{region_items.class.to_s} found" unless (region_items.instance_of?(Array) || region_items.nil?)

      site.data['regions'] << File.join(page_folder, filename)

      region_type = @options['type'] || 'html'
      region_classes = get_region_classes(context)

      tt_region_options = {
                            'id' => "tt-region-#{region_name}",
                            'class' => 'tt-region',
                            'data-region' => File.join(site.active_lang, page_folder, filename),
                            'data-region-type' => region_type,
                            'data-region-classes'=>region_classes
                          }

      if region_type == 'image'
         tt_region_options['data-suggested-height'] = @options['suggested_height']
         tt_region_options['data-suggested-width'] = @options['suggested_width']
      end
      
      script_content = nil
      if region_type == 'mixed'
        script_content = wrap('script', type: "application/json") do
          site.data['_region_config'].to_json
        end
      end

      wrap('div', tt_region_options) do
        children = []
        children << script_content
        if region_items.nil?
          #empty_region_content(include_data_path, context)
          children << empty_region_content(context)
        else
          children << region_items.each_with_index.map do |ped, index|
            #include(include_data_path, context, index, ped)
            include(context, index, ped)
          end
        end
        children.flatten.compact.join
      end
    
    rescue Exception => error
      print "\n\n"
      print error.message, "\n"
      print error.backtrace.join("\n")
      print "\n\n"
      return 'Error: ' + error.message
    end

    private

    def get_region_classes(context)
      get_region_classes_from_options(context)
    end
    
    def get_region_classes_from_options(context)
      @options['classes']
    end

    #def empty_region_content(include_data_path, context)
    def empty_region_content(context)
      include(context, 0, {"_template"=>"html"})
    end

    #def include(include_data_path, context, index, ped)
    def include(context, index, ped)
      template_name = ped['_template']
      raise "'_template' property not found in \n#{ped.to_s}" if template_name.nil?

      #liquid = Liquid::Template.parse(read_include(include_data_path, template, default_content(template)))
      template = liquid_template(template_name, context)
      liquid = Liquid::Template.parse(template)
      wrap('div', 'class' => 'tt-region_ped', 'data-ped-index' => index, 'data-ped-type' => ped['_template']) do
        context.stack do
          context["item"] = ped
          html = liquid.render!(context)
        end
      end
    end

    # def read_include(include_data_path, filename, default_content = nil)
    #   template_path = File.join(include_data_path, filename)
    #   if File.exists?(template_path)
    #     File.open(template_path, 'r') do |file|
    #       file.read
    #     end
    #   else
    #     default_content || raise("Can't find template file #{template_path}")
    #   end
    # end

    def read_data_json_from(context, locale=nil)
      site = context.registers[:site]
      locale ||= site.active_lang
      root_path = site.source
      page_folder = context['page']['path']
      
      
      data_dirs = [site.config['data_dir']].flatten
      data_dirs.reverse.each do |dir|
        region_data_path = File.join(root_path, dir, '_regions', locale, page_folder)
        path = File.join(region_data_path, filename)
        if File.exists?(path)
          File.open(path, 'r') do |file|
            return JSON.parse(file.read)
          end
        end
      end
      if locale != site.default_lang 
        return read_data_json_from(context, site.default_lang)
      else
        return nil
      end
    end

    def wrap(tag, options)
      attrs = options.map { |k,v| "#{k}='#{v}'"}.join(' ')
      "<#{tag} #{attrs}>#{yield}</#{tag}>"
    end

    def liquid_template(template_name, context)
      site = context.registers[:site]
      tpl = site.data && site.data['_region_config'] ?  site.data['_region_config'][template_name] : nil
      if tpl
        return tpl['template'].to_s
      else        
        case template_name
          when 'html'
            '{{item.content}}'
          when 'image'
            '{% assign image = item.content.croppedImage %}{% if image == nil %}{% assign image = item.content %}{% endif %}<img src="{{image.url}}" alt="{{item.content.alt}}" class="{{item.content.classes}}"/>'
          else
            '{{item.content}}'
        end
      end
    end
  end
end

