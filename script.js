
document.addEventListener("DOMContentLoaded", function () {
  const pages = document.querySelectorAll(".page");
  const navLinks = document.querySelectorAll(".nav-link");
  const pageTitle = document.getElementById("pageTitle");
  const modal = document.getElementById("feedbackModal");
  const feedbackForm = document.getElementById("feedbackForm");
  const toast = document.getElementById("toast");
  const darkToggle = document.getElementById("darkToggle");
  const nameInput = document.getElementById("nameInput");
  const profileName = document.getElementById("profileName");

  let toastTimer;

  // Show a message at the bottom of the screen.
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }

  // Navigate between screens.
  function navigateTo(pageName) {
    const targetPage = document.getElementById(pageName);

    if (!targetPage || !targetPage.classList.contains("page")) {
      return;
    }

    pages.forEach(function (page) {
      page.classList.remove("active");
    });

    targetPage.classList.add("active");

    navLinks.forEach(function (link) {
      const isActive = link.dataset.page === pageName;
      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    const titles = {
      home: "Home",
      explore: "Explore",
      profile: "My Profile",
      settings: "Settings"
    };

    pageTitle.textContent = titles[pageName] || "Home";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Sidebar navigation.
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navigateTo(link.dataset.page);
    });
  });

  // All buttons that navigate to another page.
  document.querySelectorAll("[data-go]").forEach(function (button) {
    button.addEventListener("click", function () {
      navigateTo(button.dataset.go);
    });
  });

  // Open the profile from the avatar.
  document.getElementById("profileShortcut").addEventListener("click", function () {
    navigateTo("profile");
  });

  // Open the feedback modal.
  function openFeedback() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const firstRating = modal.querySelector('input[name="rating"]');
    if (firstRating) {
      firstRating.focus();
    }
  }

  // Close the feedback modal.
  function closeFeedback() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  const feedbackButtons = [
    "sidebarFeedback",
    "openFeedback",
    "bannerFeedback",
    "exploreFeedback",
    "settingsFeedback",
    "footerFeedback"
  ];

  feedbackButtons.forEach(function (id) {
    const button = document.getElementById(id);

    if (button) {
      button.addEventListener("click", openFeedback);
    }
  });

  document.getElementById("closeModal").addEventListener("click", closeFeedback);

  // Close when clicking outside the modal.
  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeFeedback();
    }
  });

  // Close with the Escape key.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !modal.hidden) {
      closeFeedback();
    }
  });

  // Load the saved profile name.
  try {
    const savedName = localStorage.getItem("protoProfileName");

    if (savedName) {
      nameInput.value = savedName;
      profileName.textContent = savedName;
    }
  } catch (error) {
    console.warn("Profile storage is unavailable.", error);
  }

  // Save the profile name.
  document.getElementById("saveProfile").addEventListener("click", function () {
    const name = nameInput.value.trim();

    if (!name) {
      showToast("Please enter a display name first.");
      nameInput.focus();
      return;
    }

    profileName.textContent = name;

    try {
      localStorage.setItem("protoProfileName", name);
    } catch (error) {
      console.warn("Could not save the profile name.", error);
    }

    showToast("Profile updated successfully!");
  });

  // Load the saved theme.
  try {
    const savedTheme = localStorage.getItem("protoDarkMode");
    const isDark = savedTheme === "true";

    document.body.classList.toggle("dark", isDark);
    darkToggle.checked = isDark;
  } catch (error) {
    console.warn("Theme storage is unavailable.", error);
  }

  // Switch between light and dark mode.
  darkToggle.addEventListener("change", function () {
    const isDark = darkToggle.checked;

    document.body.classList.toggle("dark", isDark);

    try {
      localStorage.setItem("protoDarkMode", String(isDark));
    } catch (error) {
      console.warn("Could not save the theme.", error);
    }

    showToast(isDark ? "Dark mode enabled!" : "Light mode enabled!");
  });

  // Explain the project.
  document.getElementById("aboutButton").addEventListener("click", function () {
    alert(
      "About ProtoSpace\n\n" +
      "ProtoSpace is a student interactive prototype project built with " +
      "HTML, CSS and JavaScript.\n\n" +
      "It demonstrates navigation, animations, theme preferences and user feedback."
    );
  });

  // Submit and store user feedback.
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedRating = feedbackForm.querySelector(
      'input[name="rating"]:checked'
    );

    if (!selectedRating) {
      showToast("Please select a rating.");
      return;
    }

    const feedbackText = document.getElementById("feedbackText").value.trim();

    const feedbackEntry = {
      rating: Number(selectedRating.value),
      comment: feedbackText,
      date: new Date().toLocaleString()
    };

    try {
      const previousFeedback = JSON.parse(
        localStorage.getItem("protoFeedback") || "[]"
      );

      if (!Array.isArray(previousFeedback)) {
        throw new Error("Invalid feedback storage.");
      }

      previousFeedback.push(feedbackEntry);

      localStorage.setItem(
        "protoFeedback",
        JSON.stringify(previousFeedback)
      );
    } catch (error) {
      console.error("Could not save feedback.", error);
      showToast("Feedback could not be saved in this browser.");
      return;
    }

    feedbackForm.reset();
    closeFeedback();
    showToast("Thank you! Your feedback has been saved.");
  });

  // Start on the home screen.
  navigateTo("home");
});
