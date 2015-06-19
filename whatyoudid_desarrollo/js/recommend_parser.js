var artist = window.location.search.substring(1).split('&')[1].split('=')[1];
$.ajax("http://visualization-case.ddns.net/sonarRecom/recomArtists?artist="+artist+"&callback=?",
        {dataType:"jsonp", crossDomain: true, async: false})
        .done(function( data ) {
          console.log("hi");
          d3.select("#mainArtistName").text(artist);
          data = data.artists;
          for(var i = 0; i < data.length; ++i) {
            var slide = d3.select("#slide")
                .append('li')
                .attr('id', 'slides')
                .text(data[i].name);
            slide.append('br');
            slide.append('img')
                .attr('src', data[i].photo);
            slide.append('a')
                .attr('href', data[i].url)
                .text('More Info');
          }
          $(window).trigger('resize');
        }
);