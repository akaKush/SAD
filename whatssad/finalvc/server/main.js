import { Meteor } from 'meteor/meteor';
import { ChatCollection } from '/imports/api/ChatCollection';

const insertMsg = (msg) => ChatCollection.insert({ 
  msg: msg.msg,
  user: msg.user,
  userId: msg.id
});
 
Meteor.startup(() => {
  
});