import { Meteor } from 'meteor/meteor';
import {TasksCollection} from '../imports/api/TasksCollection';
import {chatCollection} from '../imports/api/chat';

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
});


const insertChat = (userId, userName, userMsg) => {
  chatCollection.inser({
  id: userId,
  name: userName,
  msg: userName })
};




Meteor.startup(() => {

})
