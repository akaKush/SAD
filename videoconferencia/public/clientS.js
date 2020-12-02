const socket = io('http://localhost:3000');

socket.on('chat-message', data =>{
    console.log(data)
});

const message = document.getElementById('message');
const handle = document.getElementById('handle');
const button =  document.getElementById('submit');
const output = document.getElementById('output');
const typing = document.getElementById('typing');



//  enviem que estem escrivint un missatge
message.addEventListener('keypress', () => {
    socket.emit('userTyping', handle.value)
})


//  enviar missatges a clients
button.addEventListener('click', () => {
    socket.emit('userMessage', {
        handle: handle.value,
        message: message.value
    })
    document.getElementById('message').value="";
}) 


//   escoltem a events del server
socket.on("userMessage", (data)=>{
    typing.innerHTML = "";
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})

socket.on('userTyping', (data) => {
    typing.innerHTML = '<p><em>' + data + ' is typing... </em></p>'
})


// agafem el local video i fem display d'aquest amb permisos
function getLVideo(callbacks){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;  //per si de cas el nostre navegador no funciona
    
    var constraints = {
        audio: true,
        video: true
    }

    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

function recStream(stream, elemid) {
    var video = document.getElementById(elemid)

    video.srcObject = stream;

    window.peer_stream = stream; //ens serveix per enviar el nostre stream al browser de l'altre persona
}

getLVideo({
    success: function(stream){
        window.localstream = stream;
        recStream(stream, 'lVideo');
    },
    error: function(err){
        alert("Cannot access your camera");
        console.log(err);
    }
})

var conn;
var peer_id;

//creem una connexio peer amb el peer object
var peer = new Peer(); 

//display peer id
peer.on('open', function() {
    const idCont = document.getElementById("displayId");
    console.log(idCont);
    idCont.innerHTML = peer.id
    console.log(peer.id) //així podem veure el ID del peer a la consola
})

peer.on('connection', function(connection){
    conn = connection;
    peer_id = conn.peer;
    
    document.getElementById("connID").value = peer_id;
    
});

peer.on('error', function(err){
    alert("an errar has occurred" + err);
    console.log(err);
})

//onclick amb el boto de connexió = exposem ICE info als altres participants
document.getElementById("conn_button").addEventListener('click', function(){
    peer_id = document.getElementById("connID").value;

    if(peer_id){
        conn = peer.connect(peer_id)
    }else{
        alert("enter a valid ID")
        return false;
    }
})


// apretem a "trucar" => offer and answer s'intercanvien
peer.on('call', function(call){

    var acceptCall = confirm("Vols unir-te a aquesta trucada?");

    if(acceptCall){
        call.answer(window.localstream);

        call.on('stream', function(stream){

            window.peer_stream = stream;

            recStream(stream, 'rVideo')
        });

        call.on('close', function(){
            alert("La trucada ha finalitzat");
        })
    }else{
        console.log("Trucada cancelada");
    }
});


//demanar de trucar
document.getElementById('call_button').addEventListener('click', function(){
    console.log("calling a peer: "+ peer_id);
    console.log(peer);

    var call = peer.call(peer_id, window.localstream);

    call.on('stream', function(stream){
        window.peer_stream = stream;

        recStream(stream, 'rVideo');
    })
})
