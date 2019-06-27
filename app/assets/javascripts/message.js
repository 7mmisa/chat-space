$(function(){
  function buildHTML(message){
    var image = message.image ? `<img src="${message.image}">` : "";
    var html = `<div class="message">
                  <div class="message-upper-info">
                    <div class="message-upper-info__talker">
                      ${message.user_name}
                    </div>
                    <div class="message-upper-info__data">
                      ${message.created_at}
                    </div>
                  </div>
                  <div class="message__text">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                      ${image}
                  </div>
                </div>`
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__messages').animate({ 
        scrollTop: $('.chat-main__messages')[0].scrollHeight
      }, 'fast');
      $('.chat-main__messages').append(html);
      $('#new_message')[0].reset();
    })
    .fail(function(){
      alert('error');
    })
    .always(function(data){
      $('.new_message__send').prop('disabled', false);
    });
  });

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    group_id = $('.left-box__current-group').data("group-id");
    $.ajax({
      url: '/groups/group_id/api/messages',
      type: 'get',
      dataType: 'json',
      data: {last_id: last_message_id}
    })
    .done(function(messages) {
      
      console.log('success');
    })
    .fail(function() {
      console.log('error');
    });
  };
  setInterval(reloadMessages, 5000);
});