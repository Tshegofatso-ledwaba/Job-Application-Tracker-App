const jobForm = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");

let jobs = [];

jobForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const position = document.getElementById("position").value;
  const company = document.getElementById("company").value;
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;
  const tags = document.getElementById("tags").value.split(',').map(t => t.trim());

  const job = { position, company, date, status, tags };
  jobs.push(job);

  jobForm.reset();
  displayJobs();
});

document.getElementById("filterStatus").addEventListener("change", displayJobs);
document.getElementById("sortBy").addEventListener("change", displayJobs);

function displayJobs() {
  jobList.innerHTML = "";
  const filter = document.getElementById("filterStatus").value;
  const sortBy = document.getElementById("sortBy").value;

  let filteredJobs = [...jobs];

  // Filter
  if (filter !== "All") {
    filteredJobs = filteredJobs.filter(job => job.status === filter);
  }

  // Sort
  if (sortBy === "dateAsc") {
    filteredJobs.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (sortBy === "dateDesc") {
    filteredJobs.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "status") {
    filteredJobs.sort((a, b) => a.status.localeCompare(b.status));
  }

  // Display
  filteredJobs.forEach((job, index) => {
    const div = document.createElement("div");

    let emoji = "";
    let bgColor = "";

    switch (job.status) {
      case "Applied":
        emoji = "📬"; bgColor = "#e6f7ff"; break;
      case "Interview":
        emoji = "🎤"; bgColor = "#fff3cd"; break;
      case "Rejected":
        emoji = "❌"; bgColor = "#f8d7da"; break;
      case "Offer":
        emoji = "🎉"; bgColor = "#d4edda"; break;
    }

    div.className = "job-card";
    div.style.backgroundColor = bgColor;

    div.innerHTML = `
      <strong>${job.position}</strong> at <strong>${job.company}</strong><br/>
      📅 ${job.date} | ${emoji} <em>${job.status}</em><br/>
      🏷️ ${job.tags.join(', ')}<br/>
      <button onclick="editJob(${index})">Edit</button>
      <button onclick="deleteJob(${index})">Delete</button>
    `;

    jobList.appendChild(div);
  });
}

function editJob(index) {
  const job = jobs[index];
  document.getElementById("position").value = job.position;
  document.getElementById("company").value = job.company;
  document.getElementById("date").value = job.date;
  document.getElementById("status").value = job.status;
  document.getElementById("tags").value = job.tags.join(", ");

  jobs.splice(index, 1);
  displayJobs();
}

function deleteJob(index) {
  jobs.splice(index, 1);
  displayJobs();
}

// Reminder system
function checkReminders() {
  const today = new Date();
  let message = "";

  jobs.forEach(job => {
    const appliedDate = new Date(job.date);
    const diffDays = Math.floor((today - appliedDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 14 && job.status === "Applied") {
      message += `🔔 You applied to ${job.position} at ${job.company} ${diffDays} days ago.\n`;
    }
  });

  if (message) {
    alert("Reminder:\n\n" + message);
  }
}

setInterval(checkReminders, 30000);

// Dark mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
