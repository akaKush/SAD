import { chat} from './chat';
 
Meteor.methods({

  'chat.insert'(userId, name, msg) {

    chat.insert({
      userId: userId,
      name: name,
      createdAt: new Date,
      msg: msg
    })
  }
})