(function( global, jsonp_callback ) {
		    
  var templates = (function() {
	  var common = function( contents, style ) {
      return function( index, data ) {
        return '<article class="g' + index + ' ' + data.source + '"' + (style ? ' style="' + style + '"' : '') + '>' + contents + '</article>';
      }
    };
    return {
        twitter: function(index, data) { return common('<blockquote>' + data.description + '</blockquote>')(index, data); },
        google_reader: function(index, data) { return common('<header><a href="' + data.link + '">' + data.title + '</a></header>', 'background-image: url(' + data.description + ')')(index, data); }
    };
  })();
  
  var showStream = function( data ) {
	  var stream = document.getElementById('stream'),
			  items = data.value.items, contents = '';
					
	  for( var i=0, len=items.length; i<len; i++ ) {
		  contents += templates[items[i].source](i, items[i]);
	  }
	
	  stream.innerHTML = contents;
	  stream.className = '';
  };
  
  global[jsonp_callback] = showStream;
})(this, 'showStream');
