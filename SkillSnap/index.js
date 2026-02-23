// MARK: GLOBAL VARIABLES

let selected_card_info = null;

let genrate_email = false;
let genrate_resume = false;
let genrate_coverLtter = false;

let hasUnsavedChanges = false;
let email_head = true;
let autoSaveInterval = null;
let ifram_destroyed = false;

let lastResume = null;
let lastCardNo = 0;

let resume_selectedCard = null;
let message_selectedCard = null;

// MARK: VIRTUAL SCROLL CORE
function createVirtualList(
  container,
  items,
  renderItem,
  itemHeight = 140,
  overscan = 6,
) {
  container.innerHTML = "";

  const spacer = document.createElement("div");
  spacer.className = "vs-spacer";
  container.appendChild(spacer);

  spacer.style.height = `${items.length * itemHeight}px`;

  const pool = [];

  function update() {
    const scrollTop = container.scrollTop;
    const viewportHeight = container.clientHeight;

    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan,
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + viewportHeight) / itemHeight) + overscan,
    );

    const visibleCount = Math.max(0, endIndex - startIndex + 1);

    while (pool.length < visibleCount) {
      const div = document.createElement("div");
      div.className = "vs-item";
      spacer.appendChild(div);
      pool.push(div);
    }

    for (let i = 0; i < pool.length; i++) {
      const idx = startIndex + i;
      const node = pool[i];

      if (idx <= endIndex) {
        node.style.display = "block";
        node.style.transform = `translateY(${idx * itemHeight}px)`;
        node.innerHTML = renderItem(items[idx], idx);
      } else {
        node.style.display = "none";
      }
    }
  }

  container.addEventListener("scroll", update);
  window.addEventListener("resize", update);

  update();

  return {
    refresh(newItems) {
      items = newItems;
      spacer.style.height = `${items.length * itemHeight}px`;
      update();
    },
    update,
  };
}

// MARK: SAVE
// Track changes
document.querySelector("#email_body")?.addEventListener("input", () => {
  hasUnsavedChanges = true;
});

document.querySelector(".coverleter_body")?.addEventListener("input", () => {
  hasUnsavedChanges = true;
});

document.querySelector(".resume_heading")?.addEventListener("input", () => {
  hasUnsavedChanges = true;
});

document
  .querySelector("#email_subject_input")
  ?.addEventListener("input", () => {
    hasUnsavedChanges = true;
  });

let saveIndicatorTimer = null;

function showAnimation(message, background_color) {
  let indicator = document.getElementById("save-indicator");

  // Create once
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = "save-indicator";

    Object.assign(indicator.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: "10px",
      fontSize: "14px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      opacity: "0",
      transition: "opacity 0.3s, transform 0.3s",
      transform: "translateY(20px)",
      zIndex: "9999",
      pointerEvents: "none",
    });

    document.body.appendChild(indicator);
  }

  // ✅ Update every time
  indicator.textContent = message;
  indicator.style.background = background_color;

  // ✅ Cancel previous hide timer (so it refreshes)
  if (saveIndicatorTimer) clearTimeout(saveIndicatorTimer);

  // Show
  indicator.style.opacity = "1";
  indicator.style.transform = "translateY(0)";

  // Hide after 2s
  saveIndicatorTimer = setTimeout(() => {
    indicator.style.opacity = "0";
    indicator.style.transform = "translateY(20px)";
  }, 5000);
}

// Save before switching cards

async function autoSaveBeforeSwitch() {
  if (!selected_card_info) return;
  if (!selected_card_info.html_file) return;
  showAnimation("JAST A DEMO NO CHANGE MADE", "RED");
  hasUnsavedChanges = false;
}

// AUTO-SAVE SYSTEM
function startAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  autoSaveInterval = setInterval(async () => {
    if (selected_card_info && hasUnsavedChanges) {
      console.log("🔄 Auto-saving...");
      await autoSaveBeforeSwitch();
    }
  }, 120000);
}

// Stop auto-save
function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

// BUTTON ACTIONS
document.getElementById("save-btn")?.addEventListener("click", async () => {
  if (!selected_card_info) return alert("No card selected!");
  await autoSaveBeforeSwitch();
});

// Ctrl + S Save
document.addEventListener("keydown", async (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (!selected_card_info) return alert("No card selected!");
    await autoSaveBeforeSwitch();
  }
});

// MARK: export and new
// New file
document.getElementById("Close-but")?.addEventListener("click", async () => {
  document.querySelector(".page").classList.toggle("active");
  document.querySelector(".box").classList.toggle("active");
});

document.getElementById("save_as")?.addEventListener("click", async () => {
  document.querySelector(".page").classList.toggle("active");
  document.querySelector(".box").classList.toggle("active");
});

// Export
document.getElementById("export-btn")?.addEventListener("click", async () => {
  await autoSaveBeforeSwitch();
  showAnimation("JUST A DEMO BUT MAYBE PDF CREATED..?, NAAAA..", "RED");
});

// MARK: LOAD and get JOB CARDS

const get_html_file = async (file_path) => {
  if (lastResume === file_path) return;

  if (!file_path && !genrate_resume) {
    lastResume = "";
    ifram_destroyed = false;
    document.querySelector(".ifram_box").innerHTML =
      `<div style="display:flex;justify-content:center;align-items:center;height:100%;min-height:200px;" onclick="genrate_responce('all')">${generateButtonHTML}</div>`;
    return;
  }

  lastResume = file_path;

  // create iframe if needed
  if (!ifram_destroyed) {
    ifram_destroyed = true;
    document.querySelector(".ifram_box").innerHTML =
      `<iframe class="resume-frame"></iframe>`;

    document.querySelector(".resume-frame").addEventListener("load", () => {
      const doc = document.querySelector(".resume-frame").contentDocument;
      doc.addEventListener(
        "input",
        () => {
          hasUnsavedChanges = true;
        },
        true,
      );
    });
  }

  // 🔥 IMPORTANT: load real file instead of srcdoc
  document.querySelector(".resume_heading").file_path = file_path;

  document.querySelector(".resume-frame").src =
    `./dbs/resume - html/auto/${file_path}`;
};
// MARK: resume and email
var generateButtonHTML = `
              
                <button class="generate-btn" style="
                  padding: 12px 30px;
                  font-size: 16px;
                  font-weight: bold;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                  transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)';">
                  Generate
                </button>
              
            `;

var loadingHTML = `
              <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; min-height: 200px;">
                <div style="
                  width: 50px;
                  height: 50px;
                  border: 5px solid #f3f3f3;
                  border-top: 5px solid #667eea;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                "></div>
                <p style="margin-top: 20px; color: #667eea; font-weight: bold;">Generating content...</p>
                <style>
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                </style>
              </div>
            `;

async function check_resume_email_coverletter() {
  if (!selected_card_info.cover_letter_text && !genrate_coverLtter) {
    document.querySelector(".coverleter_body").innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100%; min-height: 200px;" onclick="genrate_responce('cover_letter')">${generateButtonHTML} </div>`;
  } else {
    selected_card_info.cover_letter_text =
      selected_card_info.cover_letter_text.replace(/\n/g, "<br>");
    document.querySelector(".coverleter_body").innerHTML =
      selected_card_info.cover_letter_text;
  }

  // Email
  if (!selected_card_info.email_body && !genrate_email) {
    document.querySelector("#email_body").innerHTML =
      `<div style="display: flex; justify-content: center; align-items: center; height: 100%; min-height: 200px;" onclick="genrate_responce('email')">${generateButtonHTML} </div>`;
  } else {
    selected_card_info.email_body = selected_card_info.email_body.replace(
      /\n/g,
      "<br>",
    );

    document.querySelector("#email_body").innerHTML =
      selected_card_info.email_body;
    document.querySelector("#email_subject_input").value =
      selected_card_info.email_subject || "";
  }
  await get_html_file(selected_card_info.html_file);

  hasUnsavedChanges = false;
}

function renderEmailCard(job, query = "") {
  const activeClass =
    job.email_sent == true ? "Company_names active" : "Company_names";

  return `
    <div class="card" data-resume-id=${job.card_id}>
      <div class="card_in_flex">
        <div><b>${highlight(job.creation_type + " - " + job.head_line, query)}</b></div>
        <div style="text-align: right;">${highlight(job.company, query)}</div>
      </div>

      <div class="${activeClass}">
        ${highlight(`xyz@${job.company}.com`, query)}
      </div>

      <div class="card_in_flex">
        <div class="requerments"></div>
      </div>
    </div>
  `;
}

function renderResumeCard(job, query = "") {
  if (typeof job.mach_skills === "string") {
    try {
      job.mach_skills = JSON.parse(job.mach_skills);
    } catch {}
  }

  let skills = (job.mach_skills?.[0]?.[0] || [])
    .map((s) => `<div>${highlight(s, query)}</div>`)
    .join("");

  if (!skills) skills = `<div>No Skill Match</div>`;

  return `
    <div class="card" data-resume-id=${job.card_id}>
      <div class="card_in_flex" id="${job.resume_id}">
        <div><b>${highlight(job.creation_type + " - " + job.head_line, query)}</b></div>
        <div>${job.created_at.split(" ")[0]}</div>
      </div>

      <div class="Company_names">${highlight(job.company, query)}</div>

      <div class="card_in_flex">
        <div class="requerments">
          ${skills}
        </div>
      </div>
    </div>
  `;
}

async function loadData() {
  try {
    // load from local json instead of API
    const res = await fetch("./dbs/data.json");
    if (!res.ok) throw new Error("Failed to load data");

    const data = await res.json();

    card_json = data["response"] || data["responce"] || [];

    resume_json = [];
    email_json = [];

    card_json.reverse();

    card_json.forEach((job) => {
      job.card_id = lastCardNo;
      lastCardNo++;

      if (job.send_to_email) email_json.push(job);
      else resume_json.push(job);
    });

    const emailContainer = document.querySelector(".email_list");
    const resumeContainer = document.querySelector(".resume_list");

    emailContainer.innerHTML = "";
    resumeContainer.innerHTML = "";

    createVirtualList(
      resumeContainer,
      resume_json,
      (job) => renderResumeCard(job),
      130,
      6,
    );

    emailContainer.innerHTML = email_json
      .map((job) => renderEmailCard(job))
      .join("");

    if (email_json.length > 0)
      document.querySelector(".resume_list .card")?.click();

    if (resume_json.length > 0)
      document.querySelector(".email_list .card")?.click();

    startAutoSave();
  } catch (err) {
    console.error("Error loading JSON:", err);
  }
}

async function cardEventAdder(e, mode) {
  const card = e.target.closest(".card");
  if (!card) return;

  const list = mode === "email" ? email_json : resume_json;
  const job = list.find(
    (x) => String(x.card_id) === String(card.dataset.resumeId),
  );
  if (!job) {
    console.log("no jd");
    return;
  }

  if (hasUnsavedChanges && selected_card_info && selected_card_info !== job) {
    await autoSaveBeforeSwitch();
  }

  const containerSelector = mode === "email" ? ".email_list" : ".resume_list";
  document
    .querySelectorAll(`${containerSelector} .card.selected`)
    .forEach((c) => c.classList.remove("selected"));

  card.classList.add("selected");
  selected_card_info = job;

  if (job.resume_id) window.currentResumeId = job.resume_id;

  document.querySelector(".resume_heading").value = job.head_line || "";

  if (mode === "email") {
    message_selectedCard = card;
    document.querySelector("#email_to_input").value = job.send_to_email || "";
    document.querySelector("#email_subject_input").value =
      job.email_subject || "";
    await check_resume_email_coverletter();
  } else {
    resume_selectedCard = card;
    await get_html_file(job.html_file);
  }

  hasUnsavedChanges = false;
}

document.querySelector(".resume_list")?.addEventListener("click", async (e) => {
  await cardEventAdder(e, "resume");
});

document.querySelector(".email_list")?.addEventListener("click", async (e) => {
  await cardEventAdder(e, "email");
});

// MARK: PAGE CLEANUP
// Save before closing/refreshing page
window.addEventListener("beforeunload", (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
  }
  stopAutoSave();
});

document.querySelector("._auto")?.addEventListener("click", () => {
  resume_selectedCard.click();
  if (!email_head) {
    document.querySelector(".email_coverleter")?.classList.toggle("active");
    document.querySelector(".left_box")?.classList.toggle("active");
    document.querySelector(".left_menu")?.classList.toggle("active");
    document.querySelector(".right_box")?.classList.toggle("active");
    email_head = true;
  }

  try {
    document.querySelector(".resume_list")?.classList.add("active");
    document.querySelector(".email_list")?.classList.add("active");
    document.querySelector(".send_button")?.classList.add("active");
    document.querySelector("._auto")?.classList.add("active");
    document.querySelector("._mail")?.classList.remove("active");
  } catch {}
});

document.querySelector("._mail")?.addEventListener("click", () => {
  message_selectedCard.click();

  if (email_head) {
    document.querySelector(".email_coverleter").classList.toggle("active");
    document.querySelector(".left_box").classList.toggle("active");
    document.querySelector(".left_menu").classList.toggle("active");
    document.querySelector(".right_box").classList.toggle("active");
    email_head = false;
  }

  try {
    document.querySelector(".send_button")?.classList.remove("active");
    document.querySelector(".resume_list")?.classList.remove("active");
    document.querySelector(".email_list")?.classList.remove("active");

    document.querySelector("._auto")?.classList.remove("active");
    document.querySelector("._mail")?.classList.add("active");
  } catch {}
});

if (email_head) {
  document.querySelector(".email_coverleter").classList.toggle("active");
  document.querySelector(".left_box").classList.toggle("active");
  document.querySelector(".right_box").classList.toggle("active");
  email_head = false;
}
loadData();

//MARK: genrate
async function genrate_responce(type) {
  function disableUI() {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("disabled");
      card.style.pointerEvents = "none";
      card.style.opacity = "0.6";
    });
  }

  function enableUI() {
    document.querySelectorAll(".card").forEach((card) => {
      card.classList.remove("disabled");
      card.style.pointerEvents = "auto";
      card.style.opacity = "1";
    });
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  disableUI();

  showAnimation("NEED HELP GENRATING, CHECK THE REPO..", "RED");

  await wait(5000);

  enableUI();
}

// MARK: send email
document.querySelector(".send_button")?.addEventListener("click", async () => {
  let send_loading_btn = document.querySelector(".send_button");

  function disableUI() {
    send_loading_btn.classList.add("genrating");
    send_loading_btn.classList.add("disabled");
    send_loading_btn.style.pointerEvents = "none";
    send_loading_btn.style.opacity = "0.6";
  }

  function enableUI() {
    send_loading_btn.classList.remove("genrating");
    send_loading_btn.classList.remove("disabled");
    send_loading_btn.style.pointerEvents = "auto";
    send_loading_btn.style.opacity = "1";
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  disableUI();

  showAnimation("NO REALLY CONNECTED TO ANYTHING..", "RED");

  await wait(5000);

  enableUI();
});

document
  .querySelector("#create_new_form")
  ?.addEventListener("click", async () => {
    selected_card_info = null;
    selected_card_info = {
      creation_type: document.querySelector("#patform_form").value,
      platform: document.querySelector("#patform_form").value,
      jd: document.querySelector("#Jd_discription_form").value,
      company: document.querySelector("#companies_form").value,
      send_to_email:
        document.querySelector("#Email_ID_form").value || "No email",
    };
    selected_card_info.card_id = lastCardNo;
    email_json.push(selected_card_info);
    lastCardNo = lastCardNo + 1;
    // genrate_responce("all");
    const card = renderEmailCard(selected_card_info);

    const emailContainer = document.querySelector(".email_list");

    emailContainer.insertAdjacentHTML("afterbegin", card);

    const insertedCard = emailContainer.querySelector(".card");
    insertedCard.addEventListener("click", (e) => cardEventAdder(e, "email"));
    insertedCard.click();

    document.querySelector(".page").classList.toggle("active");
    document.querySelector(".box").classList.toggle("active");
  });

// MARK: tollbar

function enableIframeEdit() {
  const iframe = document.querySelector(".resume-frame");

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.designMode = "on";
}

function execCmd(cmd) {
  const iframe = document.querySelector(".resume-frame");

  iframe.contentWindow.focus();

  iframe.contentDocument.execCommand(cmd, false, null);
}

// Commands with value (color, font size)
function execCmdArg(cmd, value) {
  const iframe = document.querySelector(".resume-frame");

  iframe.contentWindow.focus();
  iframe.contentDocument.execCommand(cmd, false, value);
}

// Highlight selected element
document.querySelector(".resume-frame").addEventListener("load", () => {
  enableIframeEdit();
  const doc = iframe.contentDocument;
  doc.addEventListener("click", (e) => {
    doc
      .querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));
    e.target.classList.add("active");
  });
});

// cacl the hight of the div
function setContainerHeight() {
  const nav = document.querySelector(".nav");
  const menu = document.querySelector(".box_menu");
  const container = document.querySelector(".box_container");

  if (!nav || !menu || !container) return; // prevent errors

  const totalHeight = nav.offsetHeight + menu.offsetHeight;

  container.style.height = `calc(100vh - ${totalHeight}px)`;
}

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", setContainerHeight);

// Run on resize
window.addEventListener("resize", setContainerHeight);

// surch and fiter
function highlight(text, query) {
  if (!query) return text || "";
  const safe = text || "";
  const regex = new RegExp(`(${query})`, "gi");
  return safe.replace(regex, `<span class="hl">$1</span>`);
}
function matchesCard(job, query) {
  if (!query) return true;

  const fields = [
    job.creation_type,
    job.head_line,
    job.company,
    job.send_to_email,
    ...(job.mach_skills?.[0]?.[0] || []),
  ]
    .join(" ")
    .toLowerCase();

  return fields.includes(query);
}
const searchInput = document.querySelector(".surch_list");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  const filteredResume = resume_json.filter((j) => matchesCard(j, query));
  const filteredEmail = email_json.filter((j) => matchesCard(j, query));

  const resumeContainer = document.querySelector(".resume_list");
  const emailContainer = document.querySelector(".email_list");

  /* ---- RESUME LIST ---- */
  resumeContainer.innerHTML = "";

  createVirtualList(
    resumeContainer,
    filteredResume,
    (job) => renderResumeCard(job, query),
    130,
    6,
  );

  /* ---- EMAIL LIST ---- */
  emailContainer.innerHTML = filteredEmail
    .map((job) => renderEmailCard(job, query))
    .join("");
});
