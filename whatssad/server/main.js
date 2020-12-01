import { Meteor } from 'meteor/meteor';
import { Chats } from '/imports/api/chat.js';

const insertMessage = chatText => Chats.insert({ text: chatText });
 
Meteor.startup(() => {
  if (Chats.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(insertMessage)
  }
});