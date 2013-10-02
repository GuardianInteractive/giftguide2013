# encoding: utf-8
require 'csv'
require 'json'
require 'cgi'


class Builder
  #this class expects a directory of cropped, large-size images, in @picsDir folder. As it builds the json, it will check this folder to see if the image exists for the row in the spreadsheet. If the image doesn't exist, it skips the row
  def initialize
    #@picsDir = "imagesOriginal/"
    #@pics = build_pics_list
    #puts @pics.inspect
    @data = {}
    @filter_container_columns = [7,9,10,11]
    @row_hash = {
      1 => "name",
      2 => "description",
      3 => "cost",
      4 => "manufacturer",
      5 => "buyUrl",
      8 => "bigPicUrl",
    }    
    @filter_containers = build_filter_containers
    @filter_look_up = build_filter_look_up
    @gifts = build_gifts
    
    @data['gifts'] = @gifts
    @data['filterContainers'] = @filter_containers
    switch_filter_look_up
    @data['filterLookUp'] = @filter_look_up
    out = File.open('../data/gifts.json', 'w')
    out << JSON.pretty_generate(@data)
    inspect(@data)
  end
  
  def switch_filter_look_up
    tmp = {}
    @filter_look_up.each{|k,v| tmp[v] = k}
    @filter_look_up = tmp
  end
  
  def build_filter_containers
    filterContainers = []

    csv = CSV.open('../data/gifts.csv', 'r')
    headers = csv.shift
    positionInFilterContainers = {}
    headers_hash = {}
    headers.each_with_index{|h,i|
      next unless @filter_container_columns.include?(i)
      headers_hash[i] = h
      filterContainers.push({'title' => h, 'filters' => []})
      positionInFilterContainers[h] = filterContainers.length-1
    }
    #puts headers_hash.inspect
    #puts positionInFilterContainers.inspect
    #puts JSON.pretty_generate(filterContainers)
    csv.each{|row|
      row.each_with_index{|cell,i|
        next unless @filter_container_columns.include?(i)
        next unless cell
        cell.split(',').each{|filter_name|
          if !filterContainers[positionInFilterContainers[headers_hash[i]]]['filters'].include?(filter_name)
            filterContainers[positionInFilterContainers[headers_hash[i]]]['filters'] << CGI::escapeHTML(filter_name.strip)
          end
        }
        #we need to check if filter containers already containers this row's filters
      }
    }
    csv.close
    filterContainers.each{|fc|
      fc['filters'] = fc['filters'].uniq
      fc['filters'].map!{|f| 
        if f == "Ethical"
          f = "Ethical shopper"
        elsif f == "Couples"
          f = "A couple"
        else
          f
        end
      }
    }
    #puts filterContainers.inspect
    return filterContainers
  end
  
  def build_filter_look_up
    filters = []
    filter_look_up = {}
    @filter_containers.each{|c|
      c['filters'].each{|f| filters << f}
    }
    filters.each_with_index{|f,i| 
      f = f.strip
      filter_look_up[f] = i
    }
    return filter_look_up
  end 

  def build_headers_hash
    headers = csv.shift
    headers_hash = {}
    headers.each_with_index{|h,i|
      headers_hash[i] = h
    }
    puts JSON.pretty_generate(headers_hash)
  end
  
  def build_gifts
    gifts = []
    csv = CSV.open('../data/gifts.csv', 'r')
    csv.shift
    csv.each_with_index{|row, index|
      broken = false
      gift = {}
      gift['id'] = index
      gift['filters'] = []
      row.each_with_index{|cell,index|
        if @row_hash.keys.include?(index)
          if !cell
            broken = true
          end
          gift[@row_hash[index]] = CGI::escapeHTML(cell.strip) if cell
          if index == 8 #check that we have a pic in our pic folder
            next unless cell =~ /./
            if image_exists_for(cell)
              name,extension = cell.split('.')
              next unless name
              next unless extension
              puts row.inspect if name =~ /skittle/
              if extension =~ /psd/
                broken = true
              end
              gift['thumbnailPicUrl'] = name + 'Thumbnail' + '.' + extension
            else
              broken = true
            end
          elsif index == 5
            prettyBuyUrl = cell.split('/')[2]
            gift['prettyBuyUrl'] = prettyBuyUrl
          end
        elsif @filter_container_columns.include?(index)
          next unless cell
          filters = cell.split(',')
          filters.each{|f|
            f = f.strip
            if f == "Ethical"
              f = "Ethical shopper"
            elsif f == "Couples"
              f = "A couple"
            end
            gift['filters'] << @filter_look_up[f]
          }
        else
          next
        end      
      }
      gifts << gift unless broken == true
      if broken
        puts "Problem with data - or missing pic for - gift: #{row[1]} - row #{index}"
      end
    }
    return gifts

  end
  
  def inspect(data)
    filter_counts = {}
    data['gifts'].each{|g|
      g['filters'].each{|f|
        filter_name = @filter_look_up[f]
        filter_counts[filter_name] ? filter_counts[filter_name] +=1 : filter_counts[filter_name] = 1
      }
    }
  end
  
  def image_exists_for(pic)
    return true
    #return true if @pics.include?(pic)
  end
  
  # def build_pics_list
  #     pics = []
  #     Dir.foreach(@picsDir){|p|
  #       next unless p =~ /\.jpg/
  #       pics << p
  #     }
  #     return pics
  #   end
  
end

Builder.new