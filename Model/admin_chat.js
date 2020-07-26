const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const adminchat_schema = new mongoose.Schema({
    email: {
        type: String
    },
    password: {
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



//  //using middleware to encrypt password
//  adminchat_schema.pre('save', async function(next) {
//     if(this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 8)
//     }

//     next()
// })

  

//generate token and save in mongoDb doc
adminchat_schema.methods.makeToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisrun')

    user.tokens = user.tokens.concat({ token })
    await user.save()
   // console.log("token created")
    return token
}




  // check if the email and password match any
    // emails and password in the database
    adminchat_schema.statics.findBy_Identity = async (name, password) => {
       // console.log("findBy_Identity from database")
        var tt = await adminchat.find({})
      //  console.log("tt.email:  "+tt.email)
        const user = await adminchat.findOne({ email: name })
        //console.log('user: '+user)
        if (!user) {
         //   console.log('Unable to login email')
            throw new Error('Unable to login')
        }
        const isMatch = await bcrypt.compare(password, user.password)
  
        if (!isMatch) {
            throw new Error('Unable to login password')
           // console.log('Unable to login')
        }
  
        return user
    }
  


const adminchat = mongoose.model('adminchat', adminchat_schema)
module.exports = adminchat 