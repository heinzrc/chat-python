function timestamp() {
    let today = (new Date()).toTimeString().substring(0,5)
    let time = today
    return time
}
var socket = io.connect('http://' + document.domain + ':' + location.port, {'sync disconnect on unload': true });

socket.on( 'connect', function() {
    let user = prompt("Enter Username:")

    socket.emit( 'event', {
      connection : true,
      user_name : user,
      time_sent : timestamp()
    } )

    var form = $( 'form' ).on( 'submit', function( e ) {
      e.preventDefault()
      let user_input = $( 'input.text-field' ).val()

      socket.emit( 'event', {
        user_name : user,
        message : user_input,
        time_sent : timestamp()
      } )
      document.getElementById("input-wrapper").reset();
    } )
})

socket.on( 'res', function( msg ) {
    console.log( msg )
    if( typeof msg.message !== 'undefined' ) {
      $( "#chat-area" ).append( '[MESG]' + '[' + msg.time_sent + ']' + msg.user_name + ': ' + msg.message + '\n')
    }else if( msg.connection && typeof msg.connection !== 'undefined' ) {
      $( "#chat-area" ).append( '[CONN]' + '[' + msg.time_sent + ']' + msg.user_name + ': Connected to Chat\n')
    }else if( !msg.connection && typeof msg.connection !== 'undefined') {
      $( "#chat-area" ).append( '[CONN]' + '[' + msg.time_sent + ']' + msg.user_name + ': Disconnected from Chat\n')
    }
})

socket.on( 'client_update', function( msg ){
  $("#client_list").empty()
  var keys = Object.keys(msg)
  keys.forEach(function(key){
    $("#client_list").append(`<li>${msg[key]}</li>`)
  })
})