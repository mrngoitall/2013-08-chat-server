$(document).ready(function() {
  var friends = {};
  var currentRoom = 'messages';
  var chatRooms = {'messages': true};
  // Don't worry about this code, it will ensure that your ajax calls are allowed by the browser

  var refreshMessages = function() {

    $.ajax('http://127.0.0.1:8081/classes/'+currentRoom, {
      contentType: 'application/json',
      type: 'GET',
      success: function(unparsedData){
        $('#messages').html('');
        var data = JSON.parse(unparsedData);
        for (var i = 0; i < data.length; i++) {
          var $tweet = $('<p class='+data[i].username+'></p>');
          $tweet.append($("<span class='user'></span>").text(data[i].username+": "));
          $tweet.append($("<span class='message'></span>").text(data[i].message));
          $('#messages').append($tweet);
        }
        $('.user').on('click', function(){
          var friendUsername = $(this).text().slice(0,$(this).length - 3);
          var friend = '<p>' + friendUsername + '</p>';
          if(friends[friendUsername] === undefined) {
            $('#friends').append(friend);
            $('.'+friendUsername).css({'font-weight':'bold'});
          }
          friends[friendUsername] = true;
        });
        for(var key in friends){
          $('.'+key).css({'font-weight':'bold'});
        }
      },
      error: function(data) {
        console.log('Ajax request failed');
      }
    });

  };
  refreshMessages();

  var sendMessage = function() {
    if($("#username").val() === ''){
      return alert('Please enter a username!');
    }
    if($("#message").val() === ''){
      return alert('Please enter a message!');
    }

    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'http://127.0.0.1:8081/classes/'+currentRoom,
      data: '{ "message": '+JSON.stringify($("#message").val())+', \
        "username":'+JSON.stringify($("#username").val())+' }'
    });

    refreshMessages();
    $("#message").val('');
  };

  $('#submit').on('click', sendMessage);
  $("#message").keypress(function(event) {
    if ( event.which == 13 ) {
       sendMessage();
     }
  });

  $('#chooseroom').change(function(e) {
    if(this.value === 'createRoom'){
      var newRoomName = prompt('What room did you want to join?') || 'messages';
      if(chatRooms[newRoomName] === undefined){
        chatRooms[newRoomName] = true;
        var chooseRoomOptions = "";
        for(var key in chatRooms){
          if(key === newRoomName){
            chooseRoomOptions += '<option value="' + key + '" selected>' + key + '</option>';
          } else {
            chooseRoomOptions += '<option value="' + key + '">' + key + '</option>';
          }
        }
        chooseRoomOptions += '<option value="createRoom">Create a room</option>';
        $('#chooseroom').html(chooseRoomOptions);
      }
    }
    currentRoom = newRoomName || this.value;
    refreshMessages();
  });

});
