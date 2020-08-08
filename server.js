var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
const moment = require('moment')
// sk_test_51HBpyCEz5HkY0yWDo43rEOOmqUiVXjhVFSgXZB1NydskLs0DMVWgeazVrAgQyoHGxorf6hWL76lEt3Z2FzvSK8qH00DPlMh1lg
const stripe = require('stripe')('sk_test_51HBpyCEz5HkY0yWDo43rEOOmqUiVXjhVFSgXZB1NydskLs0DMVWgeazVrAgQyoHGxorf6hWL76lEt3Z2FzvSK8qH00DPlMh1lg');

//const customer_profile_rr = require("./Model/customer_profile")
var moment_object = moment()
var bcrypt = require('bcryptjs')
// var customer_profile_db = ('.//Modelll/customer_profile.js')
// var customer_profile_db = ('/m')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const auht_file = require("./Middleware/Auth")
const adminchat = require('./Model/admin_chat')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Router } = require('express');



users = [];
client_array_online = [];
var array_token_socketId = []

// Body Parser Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:false}));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


connections = [];

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

const chat_storage_Schema = new mongoose.Schema({
  chat: {
      type: String
  },
  receiver: {
    type: String
  },
  sender: {
      type: String
  },
  timeStore: {
      type: String
  },
  identifyuser: {
      type: String
  }
},
{
    timestamps: true
})

const customer_profile_schema = new mongoose.Schema({
    name: {
        type: String
    },
    new_client_token:{
        type: String
    },
    email: {
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

//chat_storage_Schema
//adminchat_schema
const customer_profile = mongoose.model('customer_profile', customer_profile_schema)
const chat_storage = mongoose.model('chat_storage', chat_storage_Schema)
//const adminchat = mongoose.model('adminchat', adminchat_schema)


// ********************************************/

server.listen(process.env.PORT || 8000);
console.log('Server running...');
console.log('listening to port 8000 from new app');

app.use(express.static("Company"));

// view engine that allow us to mix HTM and Javascrip
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);

app.get('/', async function(req, res) {
  // check if client have an identifier
  if (req.headers.cookie) {

    var cookie_parse = req.headers.cookie;
    

    var res_str2 = cookie_parse.toString();
    var length_str2 = res_str2.length;
    var pos2 = res_str2.search("dn_app_");
    var slice_str2 = res_str2.slice(pos2, length_str2);
   // console.log("token edit before slice: "+slice_str2)
    var slice_str2 = slice_str2.slice(0, 156);

  //console.log("token edit after slice: "+slice_str2)

    var check_token = await customer_profile.find({})
    var how_many_time = 0
    for (let index = 0; index < check_token.length; index++) {

      // only registered client
      if ( check_token[index].name !== "tony_req" && check_token[index].new_client_token == slice_str2 /*check_token[index].tokens[0].token == slice_str2 */) {
       // console.log("yes we find this token")
       // console.log("check_token[index]: "+check_token[index])
      } else {
       // console.log(index+") no we couldn't find this token")
        how_many_time += 1
      }
      
    }

    
   console.log(`loop as run ${how_many_time} time \n yes we find a cookie ${slice_str2}`)

        // this user have a token but check 
        // if it in the database
        if (how_many_time !== check_token.length) {
          console.log("real token, it present in the database, no need to create one")

          var cookie_parse = req.headers.cookie;
       
           var res_str = cookie_parse.toString();
           var length_str = res_str.length;
           var pos = res_str.search("dn_app_");
           var slice_str = res_str.slice(pos, length_str);

       //  if (slice_str.length > 156) {
 
       var slice_str = slice_str.slice(0, 156);

      // console.log("real slice_str: "+slice_str)
   

    var test_chat_req = await chat_storage.find({})

    var counter = 0
    var counter2 = 0
    var hidden_name="";
 
     for (let index = 0; index < test_chat_req.length; index++) {
 
            if (test_chat_req[index].identifyuser == slice_str) {
              
            counter2++
 
            if (test_chat_req[index].sender !== "Salesman") {
               hidden_name = test_chat_req[index].sender
                  // console.log("169 rooter: "+test_chat_req[index].sender)
                 }else{
                    hidden_name = test_chat_req[index].receiver
                   //console.log("172 rooter: "+test_chat_req[index].receiver )
                 }
            }
 
          counter++
        
      }

    res.render('index2', {own_token: slice_str, 
      profile_nameDB: "Salesman" ,
          arrayData: test_chat_req, 
            show_init_form: "none",
             show_chat: "block",
             have_db: "yes" ,
             hidden_name_DB: hidden_name})
    
   // }

        }else{

         //this user have a token but we couldn't 
         // find it in the database so we assign a new token
         console.log("have a token but we couldn't find it in the database")
          var cus_profile_instance = new customer_profile({
            name: 'tony_req',
            email: 'req_tony@gmail.com',
            new_client_token: 'hello'
          })
          await cus_profile_instance.save()

         

           // console.log("line 227 : "+cus_profile_instance)
    // console.log("cus_profile_instance._id : "+cus_profile_instance._id )
    var user_token = cus_profile_instance
    //const token = await cus_profile_instance.make_Token()
    const pre_token = jwt.sign({ _id: user_token._id.toString() }, 'thisrun')

   const token = "dn_app_"+pre_token
    user_token.tokens = user_token.tokens.concat({ token })
    await user_token.save()

    await res.cookie('auth_token', token)
    var cookie_parse = req.headers.cookie;
    var emptyArray = []

    
    

    res.render('index2', {own_token: token,
      profile_nameDB: "", // test_chat_req[0].receiver,
                arrayData: emptyArray, 
                show_init_form: "none", 
                show_chat: "none",
                have_db: "no",
                hidden_name_DB: ""})
          
        }

  }else{

    // this user have no identifier, provide one for them
    console.log("this user have no identifier, provide one for them")
    var cus_profile_instance = new customer_profile({
      name: 'tony_req',
      email: 'req_tony@gmail.com',
     new_client_token: 'Hello'
    })
    await cus_profile_instance.save()
  
    // console.log("line 227 : "+cus_profile_instance)
    // console.log("cus_profile_instance._id : "+cus_profile_instance._id )
    var user_token = cus_profile_instance
    //const token = await cus_profile_instance.make_Token()
    const pre_token = jwt.sign({ _id: user_token._id.toString() }, 'thisrun')

   const token = "dn_app_"+pre_token
    user_token.tokens = user_token.tokens.concat({ token })
    await user_token.save()

    await res.cookie('auth_token', token)
    var cookie_parse = req.headers.cookie;
    var emptyArray = []

    res.render('index2', {own_token: token,
      profile_nameDB: "", // test_chat_req[0].receiver,
                arrayData: emptyArray, 
                show_init_form: "none", 
                show_chat: "none",
                have_db: "no",
                hidden_name_DB: ""})

  }
  
})

app.get('/adminlogin', (req, res) => {
  res.render('admin_login', {state: "none"})
})

app.post('/data', async (req, res) => {
  
//await console.log("req.body: "+req.body)
// await console.log("req.body.email: "+req.body.email)
// await console.log("req.body.password: "+req.body.password)

  try {

    // await console.log("req.body.email: "+req.body.email)
    // await console.log("req.body.password: "+req.body.password)

  const user = await adminchat.findBy_Identity(req.body.email, req.body.password)
 
  const token = await user.makeToken()
  // console.log("503 token: "+token)
  // res.cookie('auth_token', token)
  
  // console.log("user: "+user)
  // const token = jwt.sign({ _id: user._id.toString() }, 'thisrun')

  // user.tokens = user.tokens.concat({ token })
  // await user.save()

      // console.log("token place in cookie")
 
       res.cookie('auth_token', token)

        res.redirect("/adminchat")
     // res.render("admin_chat")
  } catch (e) {
   // console.log("e: "+e)
   // console.log('/data fail')
     res.render('admin_login', {state: "block"})
  }

})



app.get('/adminchat', auht_file ,async function(req, res){

  try {
    
    var number_client = await customer_profile.find({})
    var chat_storage_ = await chat_storage.find({})
    var client_token = []
    var client_name =[]
    var tota_customer = 0
    for (let index = 0; index < number_client.length; index++) {
     // console.log("number_client tokens: "+number_client[index].tokens[0].token )
        if (number_client[index].name !== "tony_req") {
  
       
          tota_customer++
          client_token.push(number_client[index].new_client_token)
          client_name.push(number_client[index].name)
          // console.log("\n")
        }
        
    }

    for (let index = 0; index < number_client.length; index++) {
         if (number_client[index].name == "tony_req") {
          await customer_profile.findByIdAndDelete({ _id: number_client[index].id })
         }
         
     }
  
  
   
  
      res.render('admin_chat'
                              ,{ number_client_DB: number_client,
                                tota_customer_toclient: tota_customer
                                // user_token_array: client_token
                                // chat_database: chat_storage
                              } 
                               )

  } catch (e) {
    res.send("You must be login")
  }

  
})



const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 4300;
};

var createCustomer = function () {
  var param = {};
  param.email = "torimade@gmail.com";
  param.name = "toromade";
  param.description = "roses and teddy bear"

  stripe.customers.create(param, function(err, customer) {

  if (err) {
    console.log("err: "+err)
  }if (customer) {
    console.log("success: "+customer)
  }else{
   console.log("Something wrong") 
  }
    
  })
}

    app.post("/form", async (req, res) => {
        console.log("req.body.name: "+req.body.name)
    console.log("req.body.paysurname: "+req.body.paysurname )
    console.log("req.body.payemail: "+req.body.payemail)
    console.log("req.body.payaddress: "+req.body.payaddress)
    console.log("req.body.paytypeplace: "+req.body.paytypeplace)

    res.send("good dev")
    })

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;

  //createCustomer()
  // stripe.customers.create({
  //   email: req.body.stripeEmail,
  //   source: req.body.stripeToken
  // }) 
  console.log("req.body.name: "+req.body.name)
  console.log("req.body.paysurname: "+req.body.paysurname )
  console.log("req.body.payemail: "+req.body.payemail)
  console.log("req.body.payaddress: "+req.body.payaddress)
  console.log("req.body.paytypeplace: "+req.body.paytypeplace)
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


      app.post('/charge', (req, res) => {
        try {
        console.log("req.body.name: "+req.body.name )
        console.log("req.body.email: "+req.body.email)
        console.log("req.body.stripeToken: "+req.body.stripeToken)
        console.log("req.body.address: "+req.body.Address)
        console.log("req.body.amount: "+req.body.amount)
            stripe.customers.create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken,
                'address[line1]': req.body.Address,
                'address[city]': req.body.Address,
                'phone': req.body.cellnumber
            }).then(customer => stripe.charges.create({
                amount: req.body.amount * 100,
                currency: 'usd',
                customer: customer.id,
                description: 'roses and tulip bouquet'
            })).then(() => res.render('complete'))
                .catch(err => {res.render('errorPage') 
                console.log("*****************\n \n"+err)}  )
        } catch (err) { res.render('errorPage') }
      })


      app.get('/checkout', (req, res)=>{
        res.render('checkout')
      })

// app.post('/charge', (req, res) => {
//   const amount = 2500;

//   stripe.customers.create({
//     email: req.body.stripeEmail,
//     source: req.body.stripeToken
//   })
//   .then(customer => stripe.charges.create({
//     amount: amount,
//     description: 'rose and tulip bouquet',
//     currency: 'usd',
//     customer: customer.id
//   }))
//   .then(charge => res.render('success'));
// })

io.sockets.on('connection', function(socket){
    connections.push(socket);
   // console.log("connections: "+connections[0].id)
    console.log('Connection: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.userName), 1);
        updateUsernames();
       console.log("disconnect event happen")
       console.log("this socket disconnect: "+socket.id)
        io.sockets.emit("this_socket_disconnect", socket.id )
        io.sockets.emit("token_socket_disconnect", {id_disconnected: socket.id, 
                                                  array_token_socket: array_token_socketId} )
        connections.splice(connections.indexOf(socket), 1);
      //  console.log("connect[0]: "+connections)
        console.log('Connection: %s sockets connected', connections.length);
    });

    socket.on("html_need_this_client_data", async function(data){

      var check_token = await customer_profile.find({})
      var how_many_time_false = 0
      var how_many_time_true = 0
      for (let index = 0; index < check_token.length; index++) {
  
        // only registered client
        if ( check_token[index].name !== "tony_req" && check_token[index].new_client_token == data /*check_token[index].tokens[0].token == slice_str2 */) {
         // console.log("yes we find this token")
         // console.log("check_token[index]: "+check_token[index])
         how_many_time_true += 1
        } else {
         // console.log(index+") no we couldn't find this token")
         how_many_time_false += 1
        }
        
      }
  
      console.log("430 how_many_time_true: "+how_many_time_true+" how_many_time_false: "+how_many_time_false)

    })

    socket.on("client_online_token_and_socketId", function(data){
         array_token_socketId.push(data)
         io.sockets.emit("connect_respond", client_array_online)
    })

    socket.on("remove_this_id_from_online_array", function(data){
      //console.log("remove remove remove from online array data.length: "+data.length)
     // console.log("before client_array_online.length: "+client_array_online.length)
      client_array_online.splice(client_array_online.indexOf(data), 1);
      //console.log("after client_array_online.length: "+client_array_online.length)
    })
    
    
    socket.on("client_online", function(data){
      client_array_online.push(data)
     // console.log("client_array_online: "+client_array_online)
     // console.log("client_array_online.length: "+client_array_online.length)
    })
    
    socket.on("connect_question", function(data){
      //console.log("connect_question happen: "+data)
      io.sockets.emit("connect_respond", client_array_online)
    })

    
  //  console.log("client_array_online.length: "+client_array_online.length)

    // private chat functionality
    socket.on('connect_to_thisId', async function(data){

        // console.log("329 data.button_token: "+data.button_token)

      // we save the new user data and 
      // give them a token to identify them
        var customer_profile_DB = new customer_profile({
           name: data.name,
           email: data.email,
           new_client_token: data.button_token // new_client_token identifier
        })

        await customer_profile_DB.save()
     
        io.sockets.emit("new_customer", {id: data.button_token, name: data.name , socket_id: data.id })

       
      
      })

    // Send Message
    socket.on('Admin_send_message', async function(data){

        var cus_profile_instance = new chat_storage({
          chat: data.msg,
          sender:  "Salesman",
          receiver: data.sender, 
          identifyuser: data.channel,
          timeStore: moment().format('MMMM Do YYYY, h:mm a')
        })
        await cus_profile_instance.save()
        //console.log("good save from admin")

      var data_channel = data.channel
     

      io.sockets.emit('new messageAdmin', {msg: data.msg,
                                      name: data.user, 
                                     receiver : data.sender, 
                                      this_customer: data.channel, 
                                      timeMoment: moment().format('MMMM Do YYYY, h:mm a')})
    });

      // Send Message
      socket.on('send message', async function(data){

        //console.log("data.name: "+data.name)
        var cus_profile_instance = new chat_storage({
          chat: data.msg,
          sender: data.name,
          receiver: "Salesman",
          identifyuser: data.identity_req,
          timeStore: moment().format('MMMM Do YYYY, h:mm a')
        })
        await cus_profile_instance.save()
       // console.log("good save")

        // console.log("242 client data.name: "+data.name) // client name
        // console.log("243 client data.identity_req: "+data.identity_req) // client token
        // console.log("244 client data.cus_id: "+data.cus_id)

   io.sockets.emit('new message', {msg: data.msg, 
                                   name: data.name, 
                                   user_identity: data.identity_req ,
                                   this_customer: data.cus_id, 
                                   timeMoment: moment().format('MMMM Do YYYY, h:mm a')}); 
      });

      // admin ask for this token data
      socket.on('look_forThis_token', async function(data){
       // console.log("admin look for this token: "+data)
        //var number_client = await customer_profile.find({})
        var chat_database = await chat_storage.find({})
        var profile_nameDB_look = await customer_profile.find({})
        var  total_count_document = 0
        var  count_document = 0
        var user_document = [];
        var all_identifier = [];
        var all_name = [];
        var array_Chat_container_ids = []
        for (let index = 0; index < chat_database.length; index++) {
          total_count_document++;
          // const element = array[index];
          all_identifier.push(chat_database[index].identifyuser)
          all_name.push(chat_database[index].sender)
          all_name.push(chat_database[index].receiver)
          if ( chat_database[index].identifyuser == data ) {
           count_document++;
            user_document.push(chat_database[index])
          }
        }


        for (let index = 0; index < profile_nameDB_look.length; index++) {
          if (profile_nameDB_look[index].name !== "tony_req") {
          //  console.log(count_them+") chat-container_"+profile_nameDB_look[index].name+"_"+profile_nameDB_look[index].new_client_token)
            array_Chat_container_ids.push("chat-container_"+profile_nameDB_look[index].name+"_"+profile_nameDB_look[index].new_client_token)
          //  console.log("\n")
          }
          
        }


       //  console.log("Total number of doc: "+total_count_document)
        // console.log("user number of document: "+count_document)

       // console.log("*********************************** \n"+user_document)
        // send back this user data
        socket.emit("here_thisUser_docs", user_document)
        socket.emit("chat_container_id_array", array_Chat_container_ids)

      })

      socket.on("Delete_this_client", async function(data){
        
        var chat_database = await chat_storage.find({})
        var profile_nameDB_look = await customer_profile.find({})

       console.log("remove remove remove remove delete id: \n"+data)

        for (let index = 0; index < chat_database.length; index++) {
         
          if ( chat_database[index].identifyuser == data ) {

           await chat_storage.findByIdAndDelete({ _id: chat_database[index].id })
            

           }
          
        }

        var count_profile_not_find = 0
        for (let index = 0; index < profile_nameDB_look.length; index++) {
          //const element = array[index];

          if (profile_nameDB_look[index].new_client_token == data) {
           // console.log(profile_nameDB_look[index].name+" s document was delete")
           await customer_profile.findByIdAndDelete({ _id: profile_nameDB_look[index].id })
          } else {
             count_profile_not_find += 1

          }
          
        }

       // console.log(count_profile_not_find+" no math")

          socket.emit("customer_total_title", profile_nameDB_look.length)

      })

     

      socket.on("all_available_token", async function(data){
        var profile_nameDB_look = await customer_profile.find({})
        var count_them = 0;
       // console.log("profile_nameDB_look.length.length: "+profile_nameDB_look.length)
        var array_Chat_container_ids = []
        for (let index = 0; index < profile_nameDB_look.length; index++) {
          if (profile_nameDB_look[index].name !== "tony_req") {
            count_them++;
          //  console.log(count_them+") chat-container_"+profile_nameDB_look[index].name+"_"+profile_nameDB_look[index].new_client_token)
            array_Chat_container_ids.push("chat-container_"+profile_nameDB_look[index].name+"_"+profile_nameDB_look[index].new_client_token)
          //  console.log("\n")
          }
          
        }
       // console.log("total: "+count_them)

        socket.emit("all_available_token_respond", array_Chat_container_ids)

      })

    //new user
    socket.on('new user', function(data, callback){
       callback(true);
       socket.userName = data;
       users.push(socket.userName);
      // updateUsernames();
       
       io.sockets.emit('get users', data);
    });

    function updateUsernames(){
       io.sockets.emit('get users', users); 
    }
   
});