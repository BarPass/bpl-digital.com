var onReady = function() {
  var cookie = 'SS_DATA_ENTERED';
  if (!mr_cookies.hasItem(cookie)) {
    $('#ss-data-entry').modal();
    $('#ss-form').on('submit', function(e) {
      // e.preventDefault();
      // var name = $('#ss-form [name="fullname"]').val(),
      //     email = $('#ss-form [name="email"]').val(),
      //     phone = $('#ss-form [name="phone"]').val();
      // var message = name + ' has completed the form and can be contacted at ' + email + ' and ' + phone + '.';
      // $.ajax({
      //   url: 'https://slack.com/api/chat.postMessage?token=xoxp-2816536622-7910008672-261089411476-fbea256f742d55930a8242d26040dc3d&channel=%23development&text=' + message,
      //   type: 'POST',
      //   dataType: 'json',
      //   success: function (result) {
      //     console.log(result);
      //   },
      //   error: function (xhr, ajaxOptions, thrownError) {
      //     console.log(xhr.status);
      //     console.log(thrownError);
      //   }
      // });
      mr_cookies.setItem(cookie, true);
      return true;
    });
  }
};

$(document).ready(onReady);
$(document).on('page:load', onReady);
