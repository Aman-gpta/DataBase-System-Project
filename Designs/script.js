let API_URL = "http://localhost:4000/";

//signup
let myfunction = async(event) =>{   
    event.preventDefault();
let usernamee = document.getElementById("user2");
let emaill = document.getElementById("email2");
let pass = document.getElementById("password2");
usernamee = usernamee.value;
emaill = emaill.value;
pass = pass.value;
console.log(emaill);
const data = {
    username: usernamee,
    email : emaill,
    password: pass
}
console.log(JSON.stringify(data));  
localStorage.setItem("username", data.username);
        const response = await fetch(API_URL+"UserData",{
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
});
window.location.reload();
         }  ;
const wrapper=document.querySelector('.wrapper');
const loginLink=document.querySelector('.login-link');
const registerLink=document.querySelector('.register-link');



//login
let handlelogin = async()=>{
     
    let uusername = document.getElementById("email1").value;
    let passwordd = document.getElementById("password1").value;
    const data = {
        username: uusername,
        password: passwordd,
    }
    const check = await fetch(API_URL + "UserData/" + data.username)
    let ans = await check.json();
    console.log(ans);
    console.log(ans.password)
    let fetchedpass = ans.password;
    if(ans.length === 0){
        passwordauth = -2;
    }
   else if(fetchedpass===data.password){
        console.log("sign in successful")
        //document.cookie = "name=" +data.username+ "; SameSite=None; Secure";
        localStorage.setItem("username", data.username);
        passwordauth = 1;
        window.location.href = '/Designs/index4.html'
    }
    else{
        passwordauth = -1;
    }
}
//schedule

let getschedule = async(event)=>{
    event.preventDefault();
    let classroom_id = document.getElementById("classroom_id").value;
    const data = {
        id: classroom_id
    }
    const response = await fetch(API_URL + "schedule/" + data.id)
    let ans = await response.json();
    console.log(ans);
    if(ans.length === 0){
        console.log("No schedule found");
    }
    else{
        console.log("Schedule found");
        console.log(ans);
    }
    for(let i=0;i<ans.length;i++){
        document.getElementById("rows" + (i + 1) + "col1").innerHTML = ans[i].classroom_id;
            document.getElementById("rows" + (i + 1) + "col2").innerHTML = ans[i].day;
            document.getElementById("rows" + (i + 1) + "col3").innerHTML = ans[i].start_time;
            document.getElementById("rows" + (i + 1) + "col4").innerHTML = ans[i].end_time;
            document.getElementById("rows" + (i + 1) + "col5").innerHTML = ans[i].course;

    }
}   

let insertSchedule = async(event)=>{
    event.preventDefault();
    let classroom_id = document.getElementById("roomid").value;
    let day = document.getElementById("day").value;
    let start_time = document.getElementById("start").value;
    let end_time = document.getElementById("end").value;
    let course = document.getElementById("sub").value;
    const data = {
        classroom_id: classroom_id,
        day: day,
        start_time: start_time,
        end_time: end_time,
        course: course
    }
    const response = await fetch(API_URL + "schedule",{
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("Schedule inserted");
    alert
    window.location.reload();
    
}



registerLink.addEventListener('click',()=>{
    wrapper.classList.add('active');
})
loginLink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
})
