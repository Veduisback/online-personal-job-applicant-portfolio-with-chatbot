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

    origin: [
        "https://veduisback.github.io"
    ],

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


const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);



admin.initializeApp({

    credential: cert(serviceAccount)

});


const db = getFirestore();







/* ==========================
   CHAT API
========================== */


app.post("/chat", async (req,res)=>{


try{


const {

message,

slug

} = req.body;




if(!message || !slug){

return res.json({

reply:"Missing message or slug"

});

}




/* FIND USER */


const snapshot = await db
.collection("users")
.where("slug","==",slug)
.get();



if(snapshot.empty){


return res.json({

reply:"Candidate not found"

});


}



let profile = {};



snapshot.forEach(doc=>{


profile = doc.data();


});







/* AI CONTEXT */


const context = `


You are an AI assistant for a candidate portfolio.

Answer questions only using the candidate information below.


Candidate Name:

${profile.name}



Bio:

${profile.bio}



Skills:

${profile.skills}



Education:

College:
${profile.college}

Degree:
${profile.degree}

Branch:
${profile.branch}



Projects:



${profile.project1Name}

${profile.project1Details}



${profile.project2Name}

${profile.project2Details}



${profile.project3Name}

${profile.project3Details}



`;








/* OPENROUTER */


const aiResponse = await axios.post(


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

reply:reply

});





}

catch(error){


console.log(
"CHAT ERROR:",
error.response?.data || error.message
);



res.status(500)
.json({

reply:"AI server error"

});


}



});








/* ==========================
   START SERVER
========================== */


const PORT = process.env.PORT || 3000;



app.listen(PORT,()=>{


console.log(
`Server running on port ${PORT}`
);


});
