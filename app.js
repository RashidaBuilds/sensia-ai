const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");
const message = document.getElementById("assistantMessage");
const orb = document.getElementById("orb");

// create results container dynamically (so no HTML change needed)
let resultsContainer = document.createElement("div");
resultsContainer.className = "results";
document.querySelector(".chips").before(resultsContainer);

button.addEventListener("click", handleSearch);

async function handleSearch() {
  const text = input.value.trim();
  if (!text) return;

  orb.classList.add("active");

  resultsContainer.innerHTML = "";

  // 🔥 Step 1: thinking
  message.innerText = "Thinking...";

  await delay(600);

  // 🔥 Step 2: interpreting
  message.innerText = "Interpreting your description...";

  await delay(800);

  try {
    const response = await fetch("http://localhost:3000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: text })
    });

    const data = await response.json();

    if (!data.result || data.result.startsWith("❌")) {
      renderFallback();
    } else {
      renderCards(data.result);
    }

  } catch (error) {
    renderFallback();
  }

  // 🔥 Step 3: result tone
  message.innerText = "I found a few places that match what you described.";

  await delay(1200);

  // 🔥 Step 4: follow-up (THIS is the magic)
  message.innerText = "Do you remember anything else?";

  orb.classList.remove("active");
  input.value = "";
}

/* =========================
   PARSE AI RESPONSE
========================= */
function renderCards(text) {
  const lines = text.split("\n").filter(l => l.trim() !== "");

  let current = null;
  let results = [];

  lines.forEach(line => {
    if (/^\d+\./.test(line)) {
      if (current) results.push(current);
      current = { title: line.replace(/^\d+\.\s*/, ""), desc: "" };
    } else if (current) {
      current.desc += line + " ";
    }
  });

  if (current) results.push(current);

  results.slice(0, 3).forEach(createCard);
}

/* =========================
   FALLBACK (VERY IMPORTANT)
========================= */
function renderFallback(query) {
  const fakeResults = [
    {
      title: "Jabi Lake Park",
      desc: "Calm water, open space, near a mall"
    },
    {
      title: "Millennium Park",
      desc: "Green, peaceful, perfect for walking"
    },
    {
      title: "Bannex Plaza Area",
      desc: "Busy area with shops and fuel stations"
    }
  ];

  fakeResults.forEach(createCard);
}

/* =========================
   CREATE CARD
========================= */
function createCard(item) {
  const card = document.createElement("div");
  card.className = "result-card";

  card.innerHTML = `
    <div class="card-title">📍 ${item.title}</div>
    <div class="card-desc">${item.desc}</div>
    <button class="map-btn">View on map</button>
  `;

  resultsContainer.appendChild(card);
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}