const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();


const admin = require("firebase-admin");


const app = express();


app.use(cors());

app.use(express.json());



// FIREBASE ADMIN

const serviceAccount =
require("./serviceAccountKey.json");


admin.initializeApp({

credential:
admin.credential.cert(serviceAccount)

});


const db =
admin.firestore();





// CHAT API


app.post("/chat", async(req,res)=>{


try{


const {

message,

slug

}=req.body;




// FIND USER


const snapshot =

await db.collection("users")

.where(
"slug",
"==",
slug
)

.get();



if(snapshot.empty){

return res.json({

reply:"Candidate not found"

});

}




let profile;



snapshot.forEach(doc=>{

profile = doc.data();

});






// CREATE CONTEXT


const context = `

You are an AI assistant for a candidate portfolio.

Answer questions only using this candidate information.

Candidate:

Name:
${profile.name}


Bio:
${profile.bio}


Skills:
${profile.skills}


Education:
${profile.college}
${profile.degree}
${profile.branch}



Projects:

${profile.project1Name}

${profile.project1Details}


${profile.project2Name}

${profile.project2Details}


${profile.project3Name}

${profile.project3Details}



`;






// OPENROUTER


const aiResponse =

await axios.post(

"https://openrouter.ai/api/v1/chat/completions",

{


model:

"openai/gpt-4o-mini",



messages:[


{

role:"system",

content:context

},


{

role:"user",

content:message

}


]


},


{


headers:{


Authorization:

`Bearer ${process.env.OPENROUTER_API_KEY}`,


"Content-Type":

"application/json"


}


}


);





const reply =

aiResponse.data
.choices[0]
.message
.content;



res.json({

reply

});





}

catch(error){


console.log(error.response?.data || error);


res.status(500)
.json({

reply:
"AI server error"

});


}



});





app.listen(3000,()=>{


console.log(
"Server running on port 3000"
);


});
