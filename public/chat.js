var socket = io.connect('http://127.0.0.1:3000/');

var message = document.getElementById('message'),
    handle  = document.getElementById('handle'),
    btn     = document.getElementById('send'),
    output  = document.getElementById('output'),
    feedback= document.getElementById('feedback');



btn.addEventListener('click', () => {

  let text = message.value;
  let handle_ = handle.value;
  socket.emit('chat', {
    message: text,
    handle: handle_
  });


 
});

message.addEventListener('keypress', (e) => {
  let handle_ = handle.value;
  socket.emit('typing', handle_);
  if(e.keyCode == 13){
    socket.emit('chat', {
      message: e.target.value,
      handle: handle.value
    });
    e.target.value = '';
  }
  

});

socket.on('typing', (data) => {

  feedback.innerHTML = "<p><em>"+data+" is typing...</em></p>";

});

socket.on('chat', (data) => {
  
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>'+data.handle+':</strong> ' +data.message+ ' </p>';

});
