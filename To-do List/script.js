var taskInput=document.querySelector('#taskInput');
var addTask=document.querySelector('#addTask');
var btnText=addTask.innerHTML;
var records=document.querySelector('#records')
let taskStr=localStorage.getItem('details');//key
let edit_id=null;

var taskArray=[];
const completedTaskList = [];

if(taskStr!=null){
    taskArray=JSON.parse(taskStr);
}

displayInfo();

addTask.addEventListener('click',function(){
    var taskText=taskInput.value;
    var date=new Date().toLocaleString()
    if(taskText==''){
        alert('Enter Work');
    }else{
        if (edit_id!=null) {
            //edit
            taskArray.splice(edit_id,1,{'task':taskText,'date':date,'completed':false,'dateCom':null})
            edit_id=null;
        } else {
            //Insert
            taskArray.push({'task':taskText,'date':date,'completed':false,'dateCom':null})  
        }
    }
        saveInfo(taskArray);
        taskInput.value=''
        addTask.innerHTML=btnText; 
})

function saveInfo(taskArray){
    let str=JSON.stringify(taskArray);
    localStorage.setItem('details',str);
    displayInfo();
}

function displayInfo(){
    let statement=''
    taskArray.forEach((tasklist,i) => {
        statement+=`<tr>
        <th scope="row">${i+1}</th>
        <td>${tasklist.task}</td>
        <td>
            <button id="btnComp"><i class="fa-solid fa-check" onClick='CompInfo(${i})'></i></button>
            <button id="btnEdit"><i class="fa-regular fa-pen-to-square" onClick='EditInfo(${i})'></i></button>
            <button id="btnDel"><i class="fa-solid fa-trash" onClick='DeleteInfo(${i})'></i></button>
        </td>
        <td>${tasklist.date}</td>
      </tr>`;
    });
    records.innerHTML=statement;
}

function CompInfo(index){
    const task = taskArray[index];
    task.completed = true;
    task.dateCom = new Date().toLocaleString();
    completedTaskList.push(task);
    taskArray.splice(index,1)
    saveInfo(taskArray);
    displayInfo();
    renderCompletedTasks();
}

function renderCompletedTasks() {
    const completedTaskListDiv = document.getElementById("completedTaskList");
    completedTaskListDiv.innerHTML = "";
    completedTaskList.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task-item","completed-task");
        taskDiv.innerHTML = `
            <div class="task-text">${task.task}</div>
            <div>${task.dateCom}</div>
        `;
        completedTaskListDiv.appendChild(taskDiv);
    });
}

function EditInfo(id){
    edit_id=id;
    taskInput.value=taskArray[id].task;
    addTask.innerHTML='Update Task';
}

function DeleteInfo(id){
    taskArray.splice(id,1);
    saveInfo(taskArray);
    displayInfo();
}