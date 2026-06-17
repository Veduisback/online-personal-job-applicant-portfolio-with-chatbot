const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();


const admin = require("firebase-admin/app");
const { cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");



const app = express();



/* ==========================
   CORS
========================== */


app.use(cors({

    origin: "https://veduisback.github.io",

    methods: [
        "GET",
        "POST"
    ],

    allowedHeaders: [
        "Content-Type"
    ]

}));


app.use(express.json());





/* ==========================
   FIREBASE ADMIN
========================== */


if(!process.env.FIREBASE_SERVICE_ACCOUNT){

    console.log("Firebase service account missing");

}


const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);



admin.initializeApp({

    credential: cert(serviceAccount)

});



const db = getFirestore();





/* ==========================
   CHAT ROUTE
========================== */


app.post("/chat", async(req,res)=>{


try{


const {

message,

slug

}=req.body;



console.log(
"USER MESSAGE:",
message
);


console.log(
"SLUG:",
slug
);




/* FIRESTORE */


const snapshot = await db
.collection("users")
.where("slug","==",slug)
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






const context = `


You are an AI chatbot for this portfolio.

Answer questions only using this candidate data.


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







/* ==========================
   OPENROUTER DEBUG
========================== */


console.log(
"OpenRouter Key:",
process.env.OPENROUTER_API_KEY
?
process.env.OPENROUTER_API_KEY.substring(0,20)
:
"NOT FOUND"
);





/* ==========================
   OPENROUTER REQUEST
========================== */


const response = await axios.post(


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


"Authorization":

`Bearer ${process.env.OPENROUTER_API_KEY}`,



"Content-Type":

"application/json",


"HTTP-Referer":

"https://veduisback.github.io",


"X-Title":

"AI Portfolio Chatbot"



}


}



);







const reply =

response.data
.choices[0]
.message
.content;



console.log(
"AI RESPONSE:",
reply
);




res.json({

reply

});



}

catch(error){


console.log(
"FULL ERROR:",
error.response?.data || error
);



res.status(500).json({

reply:
error.response?.data?.error?.message
||
"AI server error"

});


}



});







/* ==========================
   SERVER START
========================== */


const PORT =
process.env.PORT || 3000;



app.listen(PORT,()=>{


console.log(
`Server running on port ${PORT}`
);


});
