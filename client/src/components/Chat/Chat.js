import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Messages  from '../Messages/Messages';
import Input from '../Input/Input';
import TextContainer from '../TextContainer/TextContainer';


let socket;

export default function Chat() {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://react-chatbox-application.herokuapp.com/';
  
  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);

    socket = io.connect(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit('join', { name: name, room: room }, () => {});

    return () => {
      socket.emit('disconnect');

      socket.off();
    };
  }, [ENDPOINT, window.location.search]);

  



  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);




  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
      <InfoBar room={room} />
      <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}
