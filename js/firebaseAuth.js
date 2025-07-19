// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const loader = document.getElementById("loaderOverlay");
const loginForm = document.querySelector("#loginFormElement");
const registerForm = document.querySelector("#registrationFormElement");

// login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");

  const email = document.querySelector("#loginEmail").value.trim();
  const password = document.querySelector("#loginPassword").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const dt = new Date().toISOString(); // Use ISO format for better readability
      update(ref(database, "users/" + user.uid), {
        last_login: dt,
      })
        .then(() => {
          // alert("Login successful!");
          window.location.href = "./todo.html";
        })
        .catch((error) => {
          alert("DB update failed: " + error.message);
          console.error(error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage);
      loader.classList.add("hidden");
    });
});

// Register

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loader.classList.remove("hidden");

  if (validatePassword()) {
    const fname = document.querySelector("#firstName").value.trim();
    const lname = document.querySelector("#lastName").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;

        set(ref(database, "users/" + user.uid), {
          firstName: fname,
          lastName: lname,
          email: email,
        })
          .then(() => {
            alert("User Created");
            console.log("Trying to store in DB with UID:", user.uid);
            loader.classList.add("hidden");
            auth.signOut();
            showLogin();
          }) // Error message for any fall back during storing in database
          .catch((error) => {
            alert("DB Error: " + error.message);
          });
      }) // Error message for any fall back during Signup like validation related
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        loader.classList.add("hidden");
        alert(errorMessage);
      });
  } else {
    loader.classList.add("hidden");
    return;
  }
});

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     window.location.href = "./todo.html";
//   }
// });
