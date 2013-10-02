class Resizer
  
  def initialize
    @inDir = "./assets/images/imagesOriginal/"
    @mainOutDir = "./assets/images/mainProductImages/"
    @mainSize = '1000x1000'
    @thumbnailOutDir = "./assets/images/thumbnailProductImages/"
    @thumbnailSize = '179x179'
    @fails = []
    resize
    #puts "These image paths need renaming in the spreadsheet"
    #puts @fails.inspect
  end
  
  def resize
    #create out dir for main images
    mainOutDir = File.dirname(__FILE__) + @mainOutDir
    Dir.mkdir(mainOutDir) unless Dir.exists?(mainOutDir)
    
    #create out dir for thumbnails
    thumbnailOutDir = File.dirname(__FILE__) + @thumbnailOutDir
    Dir.mkdir(thumbnailOutDir) unless Dir.exists?(thumbnailOutDir)
    
    inDir = File.dirname(__FILE__) + @inDir
    
    Dir.foreach(inDir).each{|i|
      next unless i =~ /\.jpg/
      if i =~ / /
        puts "#{i} has whitespace in it - skipping"
        @fails << i
        next
      end
      #puts i.inspect
      in_file_path = inDir + i
      out_file_path_main = mainOutDir + i
      out_file_path_thumbnail = thumbnailOutDir + create_thumbnail_path(i)
      #puts "Resizing #{i}"
      begin
        resize_image(in_file_path,out_file_path_main,out_file_path_thumbnail,mainOutDir)     
      rescue
        puts "Couldn't resize image for #{i}"
        @fails << i
      end

    }
  end
  
  def create_thumbnail_path(image_name)
    name,extension = image_name.split('.')
    thumbnail_path = name + "Thumbnail" + "." + extension
    return thumbnail_path
  end
  
  def resize_image(in_file_path,out_file_path_main,out_file_path_thumbnail,mainOutDir)
    #properties = `sips -g pixelWidth -g pixelHeight #{in_file_path}`
    #width = properties.match(/pixelWidth: \d+/).to_s.gsub('pixelWidth: ', '').to_f
    #puts [in_file_path, width].inspect
   #{}`sips --resampleWidth 1000 #{in_file_path}`
    `convert -resize #{@mainSize} #{in_file_path} #{out_file_path_main}`
    `convert -resize #{@thumbnailSize} #{in_file_path} #{out_file_path_thumbnail}`
  end
    
end

Resizer.new