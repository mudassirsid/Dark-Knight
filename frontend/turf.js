document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addTurfForm");
  const managerSection = document.getElementById("managerSection");

  if (!form || !managerSection) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const turfName = document.getElementById("turfName").value.trim();
    const turfLocation = document.getElementById("turfLocation").value.trim();
    const turfPrice = document.getElementById("turfPrice").value.trim();
    const turfPhoto = document.getElementById("turfPhoto").files[0];

    if (!turfName || !turfLocation || !turfPrice || !turfPhoto) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("turfName", turfName);
    formData.append("turfLocation", turfLocation);
    formData.append("turfPrice", turfPrice);

    try {
      const response = await fetch("http://localhost:5000/api/turf/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Turf added successfully!");
        form.reset();
      } else {
        alert(data.message || "Error adding turf.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  });
});
