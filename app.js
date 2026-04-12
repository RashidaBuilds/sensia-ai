const input = document.getElementById("userInput");
const button = document.getElementById("sendBtn");
const message = document.getElementById("assistantMessage");
const orb = document.getElementById("orb");

button.addEventListener("click", handleSearch);

function handleSearch() {
  const text = input.value;
  if (!text) return;

  orb.classList.add("active");

  message.innerText = "Thinking...";

  setTimeout(() => {
    message.innerText = "Tracing places from your memory...";

    setTimeout(() => {
      message.innerText = "I found a few places that match";
      orb.classList.remove("active");
    }, 2000);
  }, 1000);

  input.value = "";
}