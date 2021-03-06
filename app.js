const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const path = require("path");
const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const SECRET = "pakistan"
const http = require("http")
const {Server} = require("socket.io")
const fs = require("fs")
const cloudinary = require("cloudinary")
const multer = require("multer")
///SIGNUP SCHEMA///
const {signUPModel , postModel} = require("./Schema");

const cors = require("cors");
const cookieParser = require("cookie-parser");
require('dotenv').config()
require("./cloudinary/cloudinary")
///body allow///
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use(cors({origin : "http://localhost:3000" , credentials : true} ));

const DB_URI = `mongodb+srv://jaffaraman:jaffar12345@cluster0.agegk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(DB_URI);

app.use("/", express.static(path.join(__dirname, "./web/build")));

/////login API////

app.post("/api/v1/signin", (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    const userObj = {
      emailAddress: body.emailAddress,
      password: body.password,
    };
    if (!userObj.emailAddress || !userObj.password) {
      throw `Required Fields is missing`;
    } else {
      signUPModel.findOne(
        { emailAddress: userObj.emailAddress },
        async (err, data) => {
          if (err) {
            throw err;
          } else {
                if(data){
                    const isMatch = await bcrypt.compare(userObj.password, data.password)
                    .then(response=>{
                        if(response){
                            console.log(response)
                            const token =  jwt.sign({
                              _id : data._id,
                              firstName :  data.firstName,
                              lastName : data.lastName,
                              emailAddress : data.emailAddress
                            } , SECRET)
                            console.log("jwt token" , token);
                            res.cookie("token" , token , {
                              httpOnly : true,
                              maxAge : 600000000
                            })
                            res.send({status:"login successfully" , data})

                        }else{
                            res.send("password is not match")
                            console.log("isMatch not")
                        }
                    })
                    .catch(err=>console.log(err))
                    
                }else{
                    res.send("incorrect Email Address")
                }

          }
        }
      );
    }
  } catch (error) {
    res.send(error.message);
  }


});

/////SIGNUP API////

app.post("/api/v1/signup", async (req, res) => {
  const body = req.body;
  const passHash = await bcrypt.hash(body.password, 10);
  const confrmHash = await bcrypt.hash(body.confirmPassword, 10);

  // console.log(body);
  try {
    const userObj = {
      firstName: body.firstName,
      lastName: body.lastName,
      emailAddress: body.emailAddress,
      password: passHash,
      confirmPassword: confrmHash,
    };
    if (
      !userObj.firstName ||
      !userObj.lastName ||
      !userObj.emailAddress ||
      !userObj.password ||
      !userObj.confirmPassword
    ) {
      console.log(`Required Fields is missing`);
    } else {
      if (body.password !== body.confirmPassword) {
        console.log(
          `Your password's is not match`,
          body.password,
          body.confirmPassword
        );
      } else {
        signUPModel.findOne(
          { emailAddress: userObj.emailAddress },
          (err, data) => {
            if (err) {
              throw err;
            } else {
              if (data) {
                res.send("This Email Address is Already Exist");
              } else {
                signUPModel.create(userObj, (err, data) => {
                    if (err) {
                      throw err;
                    } else {
                      console.log("create data=>>", data);
                      res.send("User SuccessFully SignUp...");
                        
                    }
                  });
              }
            }
          }
        );

      }
    }
  } catch (error) {
    console.log(`Get a error During a SignUp ${error}`);
  }
});



///Barrier////
app.use((req,res,next)=>{
  console.log( "barrier req" ,req.body)
    jwt.verify(req.cookies.token , SECRET , 
      function(err,decoded){
        // console.log(decoded , "decoded");
        req.body._decoded = decoded;
        console.log(decoded)
        if(!err){
          next()
        } else{
          res.status(401).sendFile(path.join(__dirname,"./web/build/index.html"))
          // console.log("error");
        }


    })
})


///logout apii//
app.post("/api/v1/logout" , (req,res)=>{
        
        res.cookie("token" , "" , {
          httpOnly : true,
          maxAge : 30000
        })
        res.send("LOGOUT API HIT")
})


app.get("/api/v1/profile" , (req,res)=>{
    console.log("PROFILE" ,req.body._decodede)
    const emailAddress = req.body._decoded.emailAddress
    signUPModel.findOne({emailAddress : emailAddress } , (err,data)=>{
      try {
          if(err){
            throw err
          } else{
            res.send(data)
            console.log("data" , data)
          }
      } catch (error) {
          console.log(err);
      }
    })

})




app.get("/api/v1/post" , (req,res)=>{
      // const body = req.body
      // console.log(body)
      const page = Number(req.query.page)
      console.log("page" , page);
      try {

          postModel.find({}  , (err,data)=>{
              if(err){
                throw err
              }else{
                res.send(data)
                // console.log(data);
              }
          } ).sort({created_on: 'desc'})
          .skip(page).limit(5)

      } catch (error) {
        
      }
  // res.send("get")
})

app.post("/api/v1/post" , (req,res)=>{
        const body = req.body
        console.log(body)
        try {
            const userPost = {
              userId : body.userId,
              userName : body.userName,
              postCapture : body.postCapture,
              date : body.date,
              privatePost : body.privatePost
            };

           postModel.create(userPost , (err, data)=>{
             if(err){
               throw err
             }else{
               // console.log(data)
               io.emit("POST" , {
                 userId : body.userId,
                 userName : body.userName,
                 postCapture : body.postCapture,
                 date : body.date,
                 privatePost : body.privatePost
                }
                )
                res.send("SUCCESSFFULLY YOUR POST IS CREATE")
             }
           })

          

        } catch (error) {
            console.log(error);
        }
        
})

app.put("/api/v1/post" , (req,res)=>{
    const {postCap, uPostId} = req.body;
    // console.log(body);
    // console.log(req.params)
    console.log(postCap)
    console.log(uPostId)

    // const postObj = {
    //   postCapture : body.postCap,
    //   _id : body.uPostId
    // }
    try {
        postModel.findOneAndUpdate({_id : uPostId} , {postCapture : postCap} , (err,data)=>{
            if(err){
              throw err
            }else{
              res.send("update")
              console.log(data)
            }
        })
    } catch (error) {
      
    }
})

app.delete("/api/v1/post/:id" , (req,res)=>{
  // const  body  = req.body;
  // console.log(body.uPostId);
  // console.log(req.params) 
  const delObj = {
    _id : req.params.id
  } 
  console.log(delObj)
  try {
      postModel.deleteOne( delObj  , (err,data)=>{
          if(err){
            throw err
          }else{
            res.send("delete")
            console.log(data)
          }
      })
  } catch (error) {
    
  }
})


/*multer({
    storage : multer.diskStorage(),
    fileFilter : (req,res,cb)=>{
        if(file.mimetype.match(/jpag|jpg|png|gif$i/)){
            cb(null , true)
        }
    }
 })*/


//  const storage = multer.diskStorage({
//   destination : "./uploads/",
//   fileName : function(req,file,cb){
//     cb(null , `${new Date().getTime()}-${file.fileName}.${file.mimetype.split["/"][1]}}`  )
//   }
// })

// var upload =  multer({storage : storage})


// app.post("/upload" , upload.any() , async (req,res)=>{
//       console.log(req.files[0].path)
//        const result = await cloudinary.v2.uploader.upload(req.files[0].path)      
//         .then(data=>{res.send(data) , fs.unlinkSync(req.files[0].path)})
//         .catch(err=>{
//             res.send(err)
//         })
// })


app.get("/**", (req, res) => {
  res.redirect("/");
});

mongoose.connection.on("connected", () => console.log("mongoose connected"));
mongoose.connection.on("error", (error) =>
  console.log("mongoose error", error)
);

const server = http.createServer(app)



///socket io ////
const io = new Server(server , {cors : {origin : "*" , methods : '*'}})

io.on("connection" , (socket)=>{
    console.log("New client connected with id: " , socket.id);

    socket.emit("topic 1 " , "some data")

    socket.on("disconnet" , (message)=>{
      console.log("Client disconnected with id:" , message)
    })


})


// setInterval(() => {
  
//     io.emit("Test Topic " , {event : "ADDED_ITEM" , data:"some data"})
//     console.log("emiting data to all client");


// }, 2000);



server.listen(PORT, () => console.log(`Server is Running on localhost:${PORT} `));
    