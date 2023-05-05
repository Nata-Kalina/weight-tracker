let today = new Date();
let thisYear = today.getFullYear();
let footer = document.querySelector("footer");
let copyright = document.createElement("p");
copyright.innerHTML = `© Natasha Kalinicheva ${thisYear}`;
footer.appendChild(copyright);

async function buildGoalsTable(goalsTable, goalsTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/goals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [goalsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        goalsTable.replaceChildren(...children);
        return 0;
      } else {
        for (let i = 0; i < data.goals.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.goals[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.goals[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.goals[i].weightGoal}</td><td>${data.goals[i].status}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        goalsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}
async function buildWeightTable(
  weightTable,
  weightTableHeader,
  token,
  message
) {
  try {
    const response = await fetch("/api/v1/weight", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [weightTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        weightTable.replaceChildren(...children);
        return 0;
      } else {
        for (let i = 0; i < data.weights.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.weights[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.weights[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.weights[i].currentWeight}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        weightTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const loginRegister = document.getElementById("login-register");
  const login = document.getElementById("login");
  const register = document.getElementById("register");
  const loginDiv = document.getElementById("login-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const loginCancel = document.getElementById("login-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const age = document.getElementById("age");
  const height = document.getElementById("height");
  const weight = document.getElementById("weight");
  const gender = document.getElementById("gender");
  const activity_level = document.getElementById("activity_level");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const goals = document.getElementById("goals");
  const goalsTable = document.getElementById("goals-table");
  const goalsTableHeader = document.getElementById("goals-table-header");
  const addGoal = document.getElementById("add-goal");
  const editGoal = document.getElementById("edit-goal");
  const weightGoal = document.getElementById("weightGoal");
  const status = document.getElementById("status");
  const addingGoal = document.getElementById("adding-goal");
  const goalsMessage = document.getElementById("goals-message");
  const editCancel = document.getElementById("edit-cancel");
  const weight1 = document.getElementById("weight1");
  const weightTable = document.getElementById("weight-table");
  const weightTableHeader = document.getElementById("weight-table-header");
  const addWeight = document.getElementById("add-weight");
  const editWeight = document.getElementById("edit-weight");
  const currentWeight = document.getElementById("currenrWeight");
  const addingWeight = document.getElementById("adding-weight");
  const editCancelWeight = document.getElementById("edit-cancel-weight");
  const weightMessage = document.getElementById("weight-message");
  const selectGoal = document.getElementById("select-goal");
  const selectWeight = document.getElementById("select-weight");
  const about = document.getElementById("about");

  // section 2
  let showing = loginRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = loginRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildGoalsTable(
        goalsTable,
        goalsTableHeader,
        token,
        message
      );
      const count1 = await buildWeightTable(
        weightTable,
        weightTableHeader,
        token,
        message
      );

      if (count > 0) {
        goalsMessage.textContent = "";
        goalsTable.style.display = "block";
      } else {
        goalsMessage.textContent =
          "There are no goals to display for you sweetheart. It's time to set one!";
        goalsTable.style.display = "none";
      }

      goals.style.display = "block";
      showing = goals;

      if (count1 > 0) {
        weightMessage.textContent = "";
        weightTable.style.display = "block";
      } else {
        weightMessage.textContent =
          "There are no weight data for you sweetheart";
        weightTable.style.display = "block";
      }
      weight1.style.display = "block";
      showing = weight1;
    } else {
      loginRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      goals.style.display = "none";
      logoff.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      goalsTable.replaceChildren(goalsTableHeader); // don't want other users to see
      message.textContent = "You are logged off sweetheart. Have a good one!";
    } else if (e.target === login) {
      showing.style.display = "none";
      loginDiv.style.display = "block";
      showing = loginDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === loginCancel || e.target == registerCancel) {
      showing.style.display = "none";
      loginRegister.style.display = "block";
      showing = loginRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      age.value = "";
      height.value = "";
      weight.value = "";
      gender.value = "";
      activity_level.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === loginButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Login successful.  Welcome Dear ${data.user.name}!`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          about.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "Sorry, a communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name.value,
              age: age.value,
              height: height.value,
              weight: weight.value,
              gender: gender.value,
              activity_level: activity_level.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome Dear ${data.user.name}!`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            about.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            age.value = "";
            height.value = "";
            weight.value = "";
            gender.value = "";
            activity_level.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "Sorry, a communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4
    else if (e.target === addGoal) {
      showing.style.display = "none";
      editGoal.style.display = "block";
      showing = editGoal;
      delete editGoal.dataset.id;
      weightGoal.value = "";
      status.value = "set";
      addingGoal.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      weightGoal.value = "";
      status.value = "set";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingGoal) {
      if (!editGoal.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/goals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              weightGoal: weightGoal.value,
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent =
              "The goal was successfully created. Woo-hoo! Wish you the best luck in reaching your goal";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            weightGoal.value = "";
            status.value = "set";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const goalID = editGoal.dataset.id;
          const response = await fetch(`/api/v1/goals/${goalID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              weightGoal: weightGoal.value,
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "Your Goal was updated!";
            showing.style.display = "none";
            weightGoal.value = "";
            status.value = "set";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editGoal.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/goals/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          weightGoal.value = data.goal.weightGoal;
          status.value = data.goal.status;
          showing.style.display = "none";
          showing = editGoal;
          showing.style.display = "block";
          addingGoal.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The Goal was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
    //section 6. Setting Delete button
    else if (e.target.classList.contains("deleteButton")) {
      editGoal.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/goals/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent =
            "The Goal was deleted. Time to set the new one!";
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The Goal was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
  });
  //weight section
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return;
    } else if (e.target === addWeight) {
      showing.style.display = "none";
      goals.style.display = "none";
      editWeight.style.display = "block";
      showing = editWeight;
      delete editWeight.dataset.id;
      currentWeight.value = "";
      addingWeight.textContent = "add";
    } else if (e.target === editCancelWeight) {
      currentWeight.value = "";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingWeight) {
      if (!editWeight.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/weight", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentWeight: currentWeight.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The weight data was successfully added!";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            currentWeight.value = "";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "Sorry, a communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const weightID = editWeight.dataset.id;
          const response = await fetch(`/api/v1/weight/${weightID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentWeight: currentWeight.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "Your Weight was updated!";
            showing.style.display = "none";
            currentWeight.value = "";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5
    else if (e.target.classList.contains("editButton")) {
      editWeight.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/weight/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          currentWeight.value = data.weight.currentWeight;
          showing.style.display = "none";
          showing = editWeigh;
          showing.style.display = "block";
          addingWeight.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The weight was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
    //section 6. Setting Delete button
    else if (e.target.classList.contains("deleteButton")) {
      editWeight.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/weight/${e.target.dataset.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "The weight was deleted.";
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The weight was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    }
  });
});
