import { renderTask } from "./todo.js";

const dateFilter = document.querySelector("#bydate");
const statusFilter = document.querySelector("#byStatus");
const searchBtn = document.querySelector("#search-btn");
const noTaskMessage = document.querySelector("#no-todo-item");
const container = document.querySelector("#todo-container");

searchBtn.addEventListener("click", () => {
  const selectedDate = dateFilter.value; // Format: "YYYY-MM-DD"
  const selectedStatus = statusFilter.value; // 'all', 'completed', 'pending'

  // Debug logs (optional)
  // console.log("Selected Date:", selectedDate);
  // console.log("Selected Status:", selectedStatus);

  if (selectedDate == "" || selectedStatus == "") {
    alert("Select the search parameters");
    return;
  }

  // Format date to match your stored format (e.g., "3/7/2025")
  let formattedDate = "";
  if (selectedDate) {
    const [yyyy, mm, dd] = selectedDate.split("-");
    formattedDate = `${parseInt(dd)}/${parseInt(mm)}/${yyyy}`;
  }
  // Get the details from the array. and then filter.

  let db = localStorage.getItem("tasklist") || "[]"; // null || [] => []
  let taskArray = JSON.parse(db);

  // Filter tasks based on selected date and status
  const filteredTasks = taskArray.filter((task) => {
    const matchDate = !formattedDate || task.date === formattedDate;
    const matchStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "completed"
        ? task.isCompleted
        : !task.isCompleted;

    return matchDate && matchStatus;
  });

  // Clear old tasks from UI
  container.innerHTML = "";

  // Show filtered tasks or "no task" message
  if (filteredTasks.length === 0) {
    const notask = document.createElement("p");
    notask.setAttribute("id", "noFilteredTask");
    notask.innerText = "No such task based on your query";
    container.appendChild(notask);
    console.log("Showing no-task image");
  } else {
    noTaskMessage.style.display = "none";
    filteredTasks.forEach(renderTask);
  }
});
