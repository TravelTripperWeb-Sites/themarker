module Jekyll
  module TTWebFilters
    # Filters an array of objects against an expression
    #
    # input - the object array
    # property - the property to test on each object - this may be a nested set of properties separated by a '.'
    # value - the condition to match
    #
    # Returns the filtered array of objects
    def ttwhere(input, property, value)
      return input unless input.respond_to?(:select)
      input = input.values if input.is_a?(Hash) # FIXME

      input.select do |object|
        object_val = object
        property.split('.').each do |m|
          object_val = object_val.send(m)
        end
        Array(object_val).map(&:to_s).include?(value.to_s)
      end || []
    end
    
  end
end
    
    
Liquid::Template.register_filter(Jekyll::TTWebFilters)
    