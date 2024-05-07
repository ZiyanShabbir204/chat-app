import Conversation from "../models/conversation.model.mjs"
import Message from "../models/message.model.mjs"

export const sendMessage = async (req,res)=>{
    try {
        const {message} = req.body
        const {id:recieverId} = req.params
        const senderId = req.user._id
        // console.log("request user", req.user._id)

        // console.log("sender id", senderId)
        // console.log("reciverId ", recieverId)

        let conversation = await Conversation.findOne({
            participants : {$all : [recieverId,senderId]}
        })
        
        if(!conversation){
            conversation = await Conversation.create({
                participants: [recieverId,senderId]
            })
        }

        const newMessage = new Message({
            recieverId,
            senderId,
            message
        })

        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(),newMessage.save()])

        return res.status(201).json(newMessage)
        

        
    } catch (error) {
        console.log("error while creating message",error.message)
        return res.status(500).json({error :"internal server error"})
        
    }

}