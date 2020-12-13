'use strict';
const MessagesModel = require('../messeges_schema');

class MessageCat {
  constructor(model) {
    this.model = model;
  }
  read(roomId) {
    if (roomId !== undefined) {
      return this.model.findOne({ room_id: roomId });
    } else {
      return undefined;
    }
  }

  async save(record) {
    const newRecord = new this.model(record);
    let room_id = newRecord.room_id;
    let existing = await this.read(room_id);
    if (existing) {
      existing.messages=newRecord.messages;
      return await existing.save();
    }else{
      return newRecord.save();
    }
  }
  async enqueue (record){
    let messages = await this.model.findOne({ room_id: record.room_id });

    messages.messages = record.messages;

    console.log('room id ', record.room_id);
    let result = await this.model.findOneAndUpdate(
      { _id: messages._id }, messages,
      {
        new: true,
      },
    );
    console.log('result', result);
    return result;
  }

}
class Queue extends MessageCat {
  constructor() {
    super(MessagesModel);
  }
}

module.exports = new Queue();
