$(function(){
  function buildHTML(message){
    var image = message.image ? `<img src="${message.image}">` : "";
    var html = `<div class="message" data-message-id="${message.id}">
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
        scrollTop: $('.chat-main__messages')[0].scrollHeight}, 'fast');
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
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        var last_message_id = $('.message:last').data("message-id");
        var group_id = $('.left-box__current-group').data("group-id");
        var url = `/groups/${group_id}/api/messages`;
        $.ajax({
          url: url,
          type: 'get',
          dataType: 'json',
          data: {last_id: last_message_id}
        })
        .done(function(messages) {
          var insertHTML = '';
          messages.forEach(function (message) {
            insertHTML = buildHTML(message); 
            $('.chat-main__messages').append(insertHTML);
          })
          $('.chat-main__messages').animate({scrollTop: $('.chat-main__messages')[0].scrollHeight}, 'fast');
        })
        .fail(function() {
          alert('自動更新に失敗しました');
        });
      };
    };
  setInterval(reloadMessages, 5000);
});