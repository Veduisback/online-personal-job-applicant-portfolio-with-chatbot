
let profileData = {};


// GET SLUG FROM URL

const params = new URLSearchParams(
window.location.search
);


const slug = params.get("slug");



if(!slug){

alert("Invalid portfolio");

}



// LOAD USER


async function loadPortfolio(){


try{


const snapshot =
await window.db.collection("users")
.where("slug","==",slug)
.get();


if(snapshot.empty){

document.body.innerHTML =
"Portfolio not found";

return;

}



snapshot.forEach(doc=>{


profileData = doc.data();



});



displayProfile();



}

catch(error){

console.error(error);

}


}






function displayProfile(){



document.getElementById("name").innerText =
profileData.name || "";



document.getElementById("bio").innerText =
profileData.bio || "";



document.getElementById("skills").innerText =
profileData.skills || "";



document.getElementById("education").innerText =

`${profileData.college || ""}

${profileData.degree || ""}

${profileData.branch || ""}`;



let projectHTML="";



for(let i=1;i<=3;i++){


let name =
profileData[`project${i}Name`];


let details =
profileData[`project${i}Details`];



if(name){


projectHTML += `

<div class="bg-zinc-900 p-5 rounded-xl">

<h3 class="text-xl font-bold">

${name}

</h3>


<p class="text-gray-400">

${details}

</p>


</div>


`;

}


}



document.getElementById("projects")
.innerHTML = projectHTML;



}




loadPortfolio();





// CHATBOT


async function sendMessage(){



let input =
document.getElementById("message");



let msg=input.value;



if(!msg)return;



addMessage(
"You",
msg
);



input.value="";



const response =
await fetch(
"https://YOUR-RENDER-URL/chat",
{


method:"POST",

headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

message:msg,

slug:slug

})


}

);



const data =
await response.json();



addMessage(

"AI",

data.reply

);



}




function addMessage(user,text){


let box =
document.getElementById("chatBox");



box.innerHTML += `


<div class="bg-zinc-900 p-3 rounded">

<b>${user}</b>

<br>

${text}

</div>


`;



box.scrollTop =
box.scrollHeight;


}
