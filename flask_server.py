from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO
import datetime

app = Flask(__name__)
socketio = SocketIO(app)
clients = {}

def client_update():
    socketio.emit('client_update', clients)

@app.route("/")
def main():
    return render_template('index.html')

def recv(methods=['GET', 'POST']):
    print('message was received!!!')

@socketio.on('event')
def handle_event(res, methods=['GET', 'POST']):
    try:
        if (res['connection']):
            clients.update({request.sid : res['user_name']})
            print('connection received: ' + str(res))
            client_update()
        
    except (KeyError):
        print('message received: ' + str(res))
        
    socketio.emit('res', res, callback=recv)
    

@socketio.on('disconnect')
def disconnect():
    currentime = datetime.datetime.now()
    time = currentime.strftime('%H:%M')
    json = { "connection": False, "user_name": clients.get(request.sid), "time_sent":time}
    print("disconnection received: " + str(json))
    
    del clients[request.sid]
    client_update()
    socketio.emit('res', json, callback=recv)

if __name__ == "__main__":
   #app.run(host='0.0.0.0', port=80, debug=False)
   socketio.run(app, debug=True)