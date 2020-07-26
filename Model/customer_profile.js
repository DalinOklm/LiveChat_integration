const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://new_user_one:%39%30%30%31%30%30@customercouter-uk7nd.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

// mongoose.connect('mongodb://127.0.0.1:27017/customer_profile', {
//     useNewUrlParser: true,
//     useCreateIndex:true,
//     useUnifiedTopology:true
// })

const customer_profile_schema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    sender: {
        type: String
    },
    receiver: {
        type: String
    },
    chat: {
        type: String
    },
    identifyuser: {
        type: String
    },
    // store Token from jwt here
    tokens: [{
        token: {
            type: String,
            required: true
              }
         }]
},
{
    timestamps: true
})

//generate token and save in mongoDb doc
customer_profile_schema.methods.make_Token = async function() {
    const user = this
   // console.log("database customer profile: "+user)
    const token = jwt.sign({ _id: user._id.toString() }, 'thisrun')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}



const customer_profile = mongoose.model('customer_profile', customer_profile_schema)

module.exports = customer_profile