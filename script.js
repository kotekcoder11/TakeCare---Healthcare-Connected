let id;
async function fayda_verify() {
  const faydaInput = document.getElementById("fayda");
  const passwordInput = document.getElementById("password");
  const faydaAccount = faydaInput.value.trim();
  const password = passwordInput.value;

  if (!faydaAccount) {
    alert("Please enter your Fayda ID.");
    faydaInput.focus();
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  try {
    const supabaseUrl = "https://abrvlqymzaqpmgfktwfr.supabase.co/rest/v1";
    const apiKey = "sb_publishable_6YWtr3aPR8V43iInTNwnCw_jEfYrInS";
    const accountParams = new URLSearchParams({
      apikey: apiKey,
      fayda_fin_fan: `eq.${faydaAccount}`,
      password: `eq.${password}`,
    });
    const response = await fetch(
      `${supabaseUrl}/fayda-identy-test?${accountParams}`,
    );
    if (!response.ok) throw new Error("Unable to verify account.");

    const data = await response.json();
    const account = Array.isArray(data) ? data[0] : data.users?.[0];
    if (!account) throw new Error("Account not found.");

    document.body.innerHTML = `<div class="app-layout">
      <nav class="sidebar" id="app-sidebar">
        <div class="sidebar__header">
          <a href="#" class="sidebar__brand">
            <img
              src="${account.img}"
              class="rounded mx-auto d-block"
              alt="..."
              width="70px"
              style="margin-top: 10px; border-radius: 100px"
            />
          </a>
        </div>
        <ul class="sidebar__menu">
          <li>
            <a href="#" class="sidebar-link is-active"
              ><svg class="sidebar-link__icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"
                /></svg
              ><span class="sidebar-link__text">Dashboard</span></a
            >
          </li>
          <li>
            <a href="#" class="sidebar-link"
              ><i class="bi bi-capsule"></i
              ><span class="sidebar-link__text">Prescriptions</span></a
            >
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <i class="bi bi-alarm"></i
              ><span class="sidebar-link__text">Alarms</span></a
            >
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <i class="bi bi-calendar2-week"></i
              ><span class="sidebar-link__text">Appointments</span></a
            >
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <img src="assets/icons/logo_only_v1.png" alt="" width="20px" />
              <span class="sidebar-link__text">My Fayda</span></a
            >
          </li>
        </ul>
        <div class="sidebar__footer">
          <a href="index.html" class="sidebar-link" id="sidebar-collapse-btn">
            <!-- The collapse (left arrow) icon -->
            <i class="bi bi-box-arrow-left"></i>
            <!-- The expand (right arrow) icon -->
            <span class="sidebar-link__text">Log Out</span>
          </a>
        </div>
      </nav>
      <div class="page-content-wrapper">
        <header class="mobile-header">
          <button
            id="mobile-menu-open-btn"
            aria-label="Open menu"
            aria-controls="app-sidebar"
            aria-expanded="false"
          >
            &#x2630;
          </button>
          <a href="#" class="sidebar__brand"></a>
        </header>
        <main class="main-content" style="margin-top: 20px; margin-left: 20px">
          <h1><strong>Welcome, ${account.first_name}👋</strong></h1>
          <p id="activeprs_appoint"></p>
          <br />
          <div class="dashboard-cards">
            <div class="card">
              <div class="card-body">
                <h1><strong>${account.prescriptions}</strong></h1>
                <p>Active Rx</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h1><strong>${account.alarms}</strong></h1>
                <p>Alarm</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h1><strong>${account.appoint_timeleft}</strong></h1>
                <p>Appointments</p>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <h1><strong>Verified</strong></h1>
                <p>Fayda</p>
              </div>
            </div>
          </div>
          <br />
          <h2><strong>Recent Prescriptions</strong></h2>
          <div id="prescriptions">
          </div>
        </main>
      </div>
    </div>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        const sidebar = document.getElementById("app-sidebar");
        const collapseBtn = document.getElementById("sidebar-collapse-btn");
        const mobileOpenBtn = document.getElementById("mobile-menu-open-btn");
        const isCollapsedKey = "sidebarIsCollapsed";

        if (collapseBtn && sidebar) {
          if (localStorage.getItem(isCollapsedKey) === "true")
            sidebar.classList.add("is-collapsed");
          collapseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebar.classList.toggle("is-collapsed");
            localStorage.setItem(
              isCollapsedKey,
              sidebar.classList.contains("is-collapsed"),
            );
          });
        }

        if (mobileOpenBtn && sidebar) {
          mobileOpenBtn.addEventListener("click", () => {
            sidebar.classList.add("is-open");
            mobileOpenBtn.setAttribute("aria-expanded", "true");
            const overlay = document.createElement("div");
            overlay.className = "sidebar-overlay";
            document.body.appendChild(overlay);
            overlay.addEventListener("click", closeMobileMenu);
          });
        }

        function closeMobileMenu() {
          sidebar.classList.remove("is-open");
          mobileOpenBtn.setAttribute("aria-expanded", "false");
          const overlay = document.querySelector(".sidebar-overlay");
          if (overlay) overlay.remove();
        }
      });
    </script>`;
    const appointmentCount = Number(account.active_appointments) || 0;
    const prescriptionCount = Number(account.prescriptions) || 0;
    const timeleftRecentAppointment = account.appoint_timeleft || "";
    const appoints =
      appointmentCount === 1
        ? `You have one appointment ${timeleftRecentAppointment}.`
        : appointmentCount > 1
          ? `You have ${appointmentCount} appointments ${timeleftRecentAppointment}.`
          : "";
    const prescription =
      prescriptionCount === 1
        ? "You have one prescription"
        : prescriptionCount > 1
          ? `You have ${prescriptionCount} prescriptions`
          : "";
    document.getElementById("activeprs_appoint").textContent = [
      prescription,
      appoints,
    ]
      .filter(Boolean)
      .join(" and ");
    const prescriptionParams = new URLSearchParams({
      apikey: apiKey,
      for: `eq.${account.id}`,
    });
    const res = await fetch(
      `${supabaseUrl}/prescriptions?${prescriptionParams}`,
    );
    if (!res.ok) throw new Error("Unable to load prescriptions.");
    const info = await res.json();
    const prescriptions = info;
    let phtml = "";
    prescriptions.forEach((presc) => {
      phtml += `<br><div class="card">
            <div class="card-body">
              <h4><strong>${presc.prescription_name}</strong></h4>
              <p>${presc.prescription_description}</p>
            </div>
          </div>`;
    });
    document.getElementById("prescriptions").innerHTML = phtml;
    let id = account.id;
  } catch (error) {
    alert(error.message);
  }
}
