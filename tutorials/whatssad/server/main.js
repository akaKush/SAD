import { Meteor } from 'meteor/meteor';
import { chat } from '../imports/api/chat';
import { chatCollection } from '/imports/api/chatCollection';

import '../imports/api/chatMethods';

const insertChat = chat => chatCollection.insert({ })

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  
});

Meteor.publish("userList", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});