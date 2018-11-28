require_relative 'cms_region_methods'
module Jekyll
  class ModelBlock < Liquid::Block
    def initialize(tag_name, text, options)
      params = text.to_s.strip.split(',')
      @model_variable_name = params[0].strip
      @model_instance = Liquid::Variable.new(@model_variable_name)
      #@model_instance = eval(params[0].strip)
      #raise @model_instance.to_s
      super
    end
    
    def parse(tokens)
      inner_html = []
      tokens.each do |token|
        if token =~ FullToken
          break if block_delimiter == $1
        end
        inner_html << token
      end
      @inner_template = inner_html.join.to_s
      super
    end
    
    def render(context)
      model_data = @model_instance.render(context)
      opts = {
        "data-live-edit-model"=>model_data["__MODEL__"],
        "data-live-edit-model-instance"=>model_data['__INSTANCE__']
      }
      script_content = wrap('script', type: "application/json") do
        {
          "variables" => context.scopes,
          "item_variable_name" => @model_variable_name,
          "template"=>@inner_template
        }.to_json
      end

      wrap('div', opts) do
        [script_content, super].flatten.compact.join
      end
    end
    
    def wrap(tag, options)
      attrs = options.map { |k,v| "#{k}='#{v}'"}.join(' ')
      "<#{tag} #{attrs}>#{yield}</#{tag}>"
    end
    
  end
end


Liquid::Template.register_tag('model', Jekyll::ModelBlock)
