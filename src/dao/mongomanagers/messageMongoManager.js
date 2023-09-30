import { messageModel } from "../models/message.models.js"

class MessageDao {
    async findAll(limit) {
        return await messageModel.find().limit(limit);
    }

    async create(messageData) {
        return await messageModel.create(messageData);
    }
}

export const MessageManager = new MessageDao();