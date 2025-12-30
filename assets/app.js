document.addEventListener("DOMContentLoaded",()=>{
const l=document.querySelector(".loader");
if(l)l.remove();
});

function activeUsers(){
const el=document.getElementById("active");
if(!el)return;
setInterval(()=>el.textContent=120+Math.floor(Math.random()*40),1500);
}
