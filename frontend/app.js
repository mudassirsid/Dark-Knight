// =====================
// FRONTEND APP.JS
// =====================

// ====== REGISTER ======
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const phone = document.getElementById("reg-phone").value.trim();
    const city = document.getElementById("reg-city").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirm = document.getElementById("reg-confirm").value.trim();
    const role = document.getElementById("reg-role").value;
    const msg = document.getElementById("register-message");

    if (password !== confirm) {
      msg.textContent = "Passwords do not match!";
      msg.className = "message error show";
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        msg.textContent = "Registration successful! Redirecting...";
        msg.className = "message success show";
        // Store full user info from backend
        const user = { id: data.userId, name, email, role };
        localStorage.setItem("currentUser", JSON.stringify(user));
        setTimeout(() => window.location.href = "index.html", 1000);
      } else {
        msg.textContent = data.message || "Registration failed!";
        msg.className = "message error show";
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Server error!";
      msg.className = "message error show";
    }
  });
}

// ====== LOGIN ======
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const msg = document.getElementById("login-message");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.user; // {id, name, email, role}
        localStorage.setItem("currentUser", JSON.stringify(user));
        msg.textContent = "Login successful! Redirecting...";
        msg.className = "message success show";
        setTimeout(() => window.location.href = "index.html", 500);
      } else {
        msg.textContent = data.message || "Login failed!";
        msg.className = "message error show";
      }
    } catch (err) {
      console.error(err);
      msg.textContent = "Server error!";
      msg.className = "message error show";
    }
  });
}

// ====== DOM CONTENT LOADED ======
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Navbar links
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileDropdown = document.getElementById("profileDropdown");
  const userName = document.getElementById("userName");
  const logoutBtn = document.getElementById("logoutBtn");

  // Sections
  const managerSection = document.getElementById("managerSection");
  const customerSection = document.getElementById("customerSection");

  // Hide/show navbar and sections based on login
  if (currentUser) {
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
    if (profileDropdown) profileDropdown.style.display = "inline-block";
    if (userName) userName.textContent = currentUser.name;

    if (currentUser.role === "manager") {
      if (managerSection) managerSection.style.display = "block";
      if (customerSection) customerSection.style.display = "none";
    } else {
      if (managerSection) managerSection.style.display = "none";
      if (customerSection) customerSection.style.display = "block";
      loadTurfs(); // load turfs for customers
    }
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (registerLink) registerLink.style.display = "inline-block";
    if (profileDropdown) profileDropdown.style.display = "none";
    if (managerSection) managerSection.style.display = "none";
    if (customerSection) customerSection.style.display = "none";
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.reload();
    });
  }
});

// ====== MANAGER: ADD TURF ======
const addTurfForm = document.getElementById("addTurfForm");
if (addTurfForm) {
  addTurfForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const turfName = document.getElementById("turfName").value.trim();
    const turfLocation = document.getElementById("turfLocation").value.trim();
    const turfPrice = document.getElementById("turfPrice").value.trim();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "manager") {
      return alert("You must be logged in as a manager!");
    }

    if (!turfName || !turfLocation || !turfPrice || !turfPhoto) {
      return alert("All fields are required!");
    }

    const formData = new FormData();
    formData.append("turfName", turfName);
    formData.append("turfLocation", turfLocation);
    formData.append("turfPrice", turfPrice);
    formData.append("managerId", currentUser.id);

    try {
      const res = await fetch("http://localhost:5000/api/turfs/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Turf added successfully!");
        addTurfForm.reset();
      } else {
        alert(data.message || "Error adding turf!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server!");
    }
  });
}

// ====== CUSTOMER: LOAD TURFS ======
async function loadTurfs() {
  try {
    const res = await fetch("http://localhost:5000/api/turfs");
    const turfs = await res.json();
    const turfList = document.getElementById("turfList");
    if (!turfList) return;

    if (!Array.isArray(turfs) || turfs.length === 0) {
      turfList.innerHTML = "<p>No turfs available yet.</p>";
      return;
    }

    turfList.innerHTML = turfs
      .map(
        (t) => `
      <div class="turf-card">
        <img src="http://localhost:5000/uploads/${t.photo || 'default_turf.jpg'}" alt="${t.name}">
        <h4>${t.name}</h4>
        <p>📍 ${t.location}</p>
        <p>💸 ₹${t.price_per_hour}/hr</p>
        <button onclick="bookTurf(${t.id})">Book</button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

function bookTurf(id) {
  localStorage.setItem("selectedTurf", id);
  window.location.href = "book.html";
}
