require('dotenv').config()

const express= require('express')

const bodyParser= require('body-parser')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const DB_PASS = process.env.DB_PASS

const pgp = require('pg-promise')()
const PORT = process.env.PORT || 8080

app.use(cors())


app.use(bodyParser.json({limit: '50mb'}))



 connectionString = {
    "host": "isilo.db.elephantsql.com",
    "port": 5432,
    "database": "wqvacxnt",
    "user": "wqvacxnt",
    "password":DB_PASS
  
  }

db = pgp(connectionString)






function authenticate(req,res, next) {

  let headers = req.headers["authorization"]
  
  let token = headers.split(' ')[1]
  console.log(token)

  jwt.verify(token,'secret',(err, decoded) => {
    if(decoded) {
      console.log(decoded)
      if(decoded.id) {
        console.log(decoded.id)
        next()
      } else {
        res.status(401).json({message: 'Token invalid'})
      }
    } else {
      res.status(401).json({message: 'Token invalid'})
    }
  })

}


app.get('/', (req, res) => {
    res.send('hello')
})


app.get('/hello', (req,res) => {
  res.send('heroku works')
})



  //adding a new user 
  app.post('/register', (req,res) => {
    //removed name requirements from registration
     let userName = req.body.userName
    // let firstName = req.body.firstName
    //let lastName= req.body.lastName
    let hash = bcrypt.hashSync(req.body.password, saltRounds)
//console.log(userName,hash)

    db.one('SELECT EXISTS(SELECT user_name FROM users WHERE user_name = $1)', [userName])
    .then((user) => {
      if (user.exists) {
        res.json({exists: true})
      } else {
        //db.one('INSERT INTO users (first_name,last_name,user_name, hash) VALUES($1,$2,$3,$4) RETURNING id', [firstName, lastName,userName, hash])
        db.one('INSERT INTO users (user_name, hash) VALUES($1,$2) RETURNING id', [userName, hash])
        .then((added)=>{
          if(added){
           // console.log(added)
            res.json({success: true})
          }
          else {
            res.json({success: false, message: 'Error adding user'})
          }
        
        })
        
      }
    })
  })


//getting saved markers id's
app.post('/get-favorites',authenticate,(req,res)=>{
  let user=req.body.userId
  console.log("get user",user)
  db.any('SELECT marker_lat as lat, marker_long as long, marker_id as ts FROM environmental_table WHERE user_id =$1',[user])
  .then((favorites)=>{
    res.json({favorites})
  })
  //console.log(user)
  //res.json({user})

})
//removing favorite marker by user id and marker id 

app.post('/remove-favorite',authenticate,(req,res)=>{
let user = req.body.userId
let pgaId = parseInt(req.body.playerId)
//console.log(user,pgaId)

db.any('DELETE FROM environmental_table WHERE marker_id = $1 AND user_id = $2 RETURNING id',[pgaId,user])
.then((deleted)=>{
  if (deleted){
    //console.log(deleted)
    res.json({message:"removed"})
  }
  

}).catch((error)=>{
  res.status(500).json({message:  'something wrong '})
})

})


//posting saved golfer

app.post('/save-favorite',authenticate,(req,res)=>{
//console.log(req.body.playerId)
let user =req.body.userId
let markerId = req.body.ts
let markerLat = req.body.markLat
let markerLong=req.body.markLong
console.log(user,markerId,markerLat,markerLong)
//res.json("success")


db.one('INSERT INTO environmental_table (marker_lat,marker_long, marker_id, user_id) VALUES($1,$2,$3,$4) RETURNING id', [markerLat,markerLong,markerId, user])
.then((success)=>{
  //console.log(success)
  if(success){
    //console.log(success)
    res.json({success: true,message:'weve added one'})
  }
  else {
    res.json({error, message: 'need to be logged in '})
  }
}
).catch((error)=>{
  res.status(500).json({message:  'need to be logged in '})
})

})

 // logging in new user

 app.post ('/login',(req,res) => {
  let userName = req.body.userName
  //console.log(userName)
  db.one('SELECT EXISTS(SELECT user_name FROM users WHERE user_name = $1)', [userName])
  .then((user) => {
    //console.log(user.exists)
    if (user.exists){
      //console.log("we got one")
      db.one('SELECT hash,id FROM users WHERE user_name=$1', [userName])
      .then((logger)=>{
        bcrypt.compare(req.body.password, logger.hash, function(err, result){
          if (result){
            //console.log(logger)
            jwt.sign({ id:logger.id}, 'secret', function(err, token) {
              //console.log(token,logger.id)

              if(token != false)  {
                res.json({token: token,uid:logger.id})
              } else {
                res.json({message: 'Unable to generate token'})
              }
      
          });
          }else{
            res.json(result)
            //.log("error coming back")
            //console.log(result)
          }

        })
      })
    
      }
    
        
    
      else{
        //console.log("error")
       }
    })
  
  })
  
        
  app.post('/apisc',(req,res) => {

    const title = req.body
  
  
    db.one('INSERT INTO environmental_table (saved_json) VALUES($1) RETURNING id', [title])
.then((success)=>{
  //console.log(success)
  if(success){
    //console.log(success)
    res.json({success: true,message:'weve added one'})
  }
  else {
    res.json({error, message: 'need to be logged in '})
  }
}
).catch((error)=>{
  res.status(500).json({message:  'need to be logged in '})
})

})

  
    
  
  
app.listen(PORT,()=>{
console.log("At your service")
})
