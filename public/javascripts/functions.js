var deleteHit = function(id) {
  console.log('something')
  console.log('id', id)
  var apiUrl = 'http://localhost:3000/hits/'+id
  $.ajax({
      url: apiUrl,
      type: 'DELETE',
      cache: false,
      statusCode: {
          200: function (data) {

          }, // Successful DELETE
          404: function (data) {
              alert(apiUrl + " ... Not Found");
          }, // 404 Not Found
          400: function (data) {
              alert("Bad Request O");
          } // 400 Bad Request
      } // statusCode
  }); // ajax call
  $('#hitsTable').on('click', ":button", function(){
    $(this).closest ('tr').remove ();
  });
}

//- (function($) {
//-   $('tr').click( function() {
//-     window.location = $(this).find('a').attr('href');
//-   }).hover( function() {
//-     $(this).toggleClass('hover');
//-   });
//- })(jQuery);
