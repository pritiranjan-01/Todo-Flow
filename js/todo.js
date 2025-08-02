const body = document.body;
const container = document.querySelector("#todo-container");
const notodoitem = document.querySelector("#no-todo-item");
const task = document.querySelector("#addtask"); /// Entered-Task
const addtask = document.querySelector("#addbtn"); /// plus button
const statisticsDivision= document.querySelector(".statistics")
const totalTask=document.querySelector("#total-task");
const compltedTask=document.querySelector("#completed-task");
const pendingTask=document.querySelector("#pending-task");
const completionRate=document.querySelector("#completion-rate");
const expandbtn= document.querySelector("#expand-btn");

function getDate() {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Add 1 as month is 0-indexed
  let year = currentDate.getFullYear();
  return `${day}/${month}/${year}`;
}

function generateId() {
  let id = localStorage.getItem("taskIdCounter");
  //   console.log(id);
  if (id === null) {
    id = 0;
  } else {
    id = parseInt(id) + 1;
  }
  localStorage.setItem("taskIdCounter", id);
  return id;
}

let db = localStorage.getItem("tasklist") || "[]"; // null || [] => []
export let taskArray = JSON.parse(db);

//statistics
function statistics(){
  totalTask.innerText=taskArray.length;
  let count=0;
  taskArray.filter((ele)=>{
  if(ele.isCompleted==true)
    count++;
  })
  compltedTask.innerText=count;
  pendingTask.innerText=taskArray.length-count;
  completionRate.innerText= taskArray.length === 0 ? "0%" : (count / taskArray.length * 100).toFixed(1) + "%";;
}

if (taskArray.length === 0) {
  statisticsDivision.style.display="none";
  notodoitem.style.display = "block";
} else {
  statisticsDivision.style.display="flex";
  statistics();
  taskArray.forEach((ele) => {
    renderTask(ele);
  });
}

export function renderTask(ele) {
  notodoitem.style.display = "none";
  const div = document.createElement("div");
  div.setAttribute("class", "task-card");
  div.setAttribute("task-card-id", ele.id); // task id= objec.id
  // Delete, Edit, Complete Button
  div.innerHTML = ` 
   <input id="taskname" disabled type="text" class="taskname ${
     ele.isCompleted ? "completed" : ""
   }" value="${ele.text}" 
/>
  <span>
    <button class="mark-complete"> <i class="fa-solid fa-circle-check"></i> </button>
    <button class="edit"> <i class="fa-solid fa-pen"></i> </button>
    <button class="delete"> <i class="fa-solid fa-trash"></i> </button>
  </span>
  `;
  container.prepend(div);
}

addtask.addEventListener("click", (e) => {
  if (task.value == "") {
    alert("Enter the task to Add");
    return;
  } else {
    // Reset filter UI and remove filter message
    const bydate = document.getElementById("bydate");
    const byStatus = document.getElementById("byStatus");
    if (bydate) bydate.value = "";
    if (byStatus) byStatus.value = "";

    // Remove filter message if present
    const noFilteredTask = document.getElementById("noFilteredTask");
    if (noFilteredTask) noFilteredTask.remove();

    // Show all tasks (clear previous todo cards and re-render)
    container.innerHTML = "";

    // Add the new task
    const obj = {
      id: generateId(),
      text: task.value,
      date: getDate(),
      isCompleted: false,
    };

    taskArray.push(obj);
    localStorage.setItem("tasklist", JSON.stringify(taskArray));
    task.value = "";
    statisticsDivision.style.display = "flex";
    statistics();
    // Render all tasks
    taskArray.forEach((ele) => {
      renderTask(ele);
    });
  }
});


//! Codes for button (Edit, Mark-as-complete, delete)

// 🔁 Event delegation for button clicks inside task cards
container.addEventListener("click", (e) => {
  const taskCard = e.target.closest(".task-card");
  //  console.log(taskCard);
  if (!taskCard) return;

  // 1️⃣ Get object.id value from card
  const taskId = Number(taskCard.getAttribute("task-card-id"));
  //  console.log(taskId); //getting the id of the object
  
  const taskIndex = taskArray.findIndex((e) => e.id === taskId);
//  console.log("Array element is clicked of index: " + taskIndex); // geting the index of the object from the array

  // ✅ Delete button event handling
  if (e.target.closest(".delete")) {
    taskArray.splice(taskIndex, 1); // Remove 1 item starting at index taskIndex from the array
    taskCard.remove(); // remove from UI
    statistics();
    localStorage.setItem("tasklist", JSON.stringify(taskArray));

    // Show "no tasks" message if list is empty
    if (taskArray.length === 0) {
      statisticsDivision.style.display="none"
      notodoitem.style.display = "block";
    }
  }

  // ✅ Mark as Complete
  if (e.target.closest(".mark-complete")) {
    taskArray[taskIndex].isCompleted = !taskArray[taskIndex].isCompleted;
    const taskName = taskCard.querySelector("#taskname");
    taskName.classList.toggle("completed");
    localStorage.setItem("tasklist", JSON.stringify(taskArray));
    statistics();
  }

  // ✅ Edit as Task
  if (e.target.closest(".edit")) {
    const inputField = taskCard.querySelector("#taskname");
    const editBtn = e.target.closest(".edit");
    const icon = editBtn.querySelector("i");

    if (inputField.disabled) {
      // Start editing
      inputField.disabled = false;
      inputField.style.backgroundColor="white";
      inputField.style.color="black";
      inputField.focus();
      icon.classList.remove("fa-pen");
      icon.classList.add("fa-check");
    } else {
      // Save edited task
      const newText = inputField.value;
      inputField.style.backgroundColor="";
      inputField.style.color="";
      if (newText === "") {
        alert("Task can't be empty!");
        return;
      }
      taskArray[taskIndex].text = newText;
      localStorage.setItem("tasklist", JSON.stringify(taskArray));

      inputField.disabled = true;
      icon.classList.remove("fa-check");
      icon.classList.add("fa-pen");
    }
  }
});

//Getting the User First name from db.

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// 1. Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBmb8NKeT6FN7oa8r_uYO1MWR-2OTOHESo",
  authDomain: "todo-list-user-authentication.firebaseapp.com",
  databaseURL:
    "https://todo-list-user-authentication-default-rtdb.firebaseio.com/",
  projectId: "todo-list-user-authentication",
  storageBucket: "todo-list-user-authentication.appspot.com",
  messagingSenderId: "338682924687",
  appId: "1:338682924687:web:13c7e24ae341616c4feafa",
  measurementId: "G-3CW15T9HR1",
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbs = getDatabase(app);

// 3. Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;

    // 4. Fetch user details from Realtime Database
    const userRef = ref(dbs, "users/" + uid);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          //console.log("First Name:", userData.firstName);

          // Example: Show it in your UI
          document.querySelector(
            "#nameGreet"
          ).textContent = `Hi! ${userData.firstName}`;
        } else {
          console.log("No user data found in DB");
        }
      })
      .catch((error) => {
        console.error("Database error:", error);
      });
  } else {
    window.location.href = "../pages/login.html";
  }
});

document.getElementById("logoutBtn");
// Logout event
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out.");
      // Redirect to login page
      window.location.href = "../pages/login.html"; // adjust path if needed
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
});

// Expand section

expandbtn.addEventListener("click", () => {
  const statsMinimised = document.querySelector(".stats-minimised") || document.querySelector(".statistics");
  const minimisedSections = document.querySelectorAll(".minimised, .statistics > section");
  const hideCompletionRate = document.querySelector("#complition-section");
  const statLabelMinimised = document.querySelectorAll(".stat-lebel, .stat-lebel-minimised");

  // Toggle .stats-minimised on container
  statsMinimised.classList.toggle("stats-minimised");

  // Toggle .minimised on each stat section
  minimisedSections.forEach(el => {
    el.classList.toggle("minimised");
  });

  // Toggle .minimised-none-complition-sec on completion section
  hideCompletionRate.classList.toggle("minimised-none-complition-sec");

  // Toggle .stat-lebel-minimised on each label
  statLabelMinimised.forEach(el => {
    el.classList.toggle("stat-lebel-minimised");
  });
});
