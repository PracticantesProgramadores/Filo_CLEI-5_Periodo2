const slides = [...document.querySelectorAll(".slide")];
const slideTitle = document.getElementById("slideTitle");
const sectionBadge = document.getElementById("sectionBadge");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const infoModal = document.getElementById("infoModal");
const mapModal = document.getElementById("mapModal");
let currentSlide = 0;

const characterLabels = {
  "san-agustin": "San Agustín de Hipona",
  "san-anselmo": "San Anselmo de Canterbury",
  platon: "Platón",
  aristoteles: "Aristóteles",
  "santo-tomas": "Santo Tomás de Aquino",
  ockham: "Guillermo de Ockham"
};

function getHashSlide() {
  const hashIndex = Number(window.location.hash.replace("#", ""));
  if (!Number.isInteger(hashIndex) || hashIndex < 1) return 0;
  return Math.min(hashIndex - 1, slides.length - 1);
}

function showSlide(index) {
  currentSlide = Math.max(0, Math.min(index, slides.length - 1));
  slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
  const slide = slides[currentSlide];
  slideTitle.textContent = slide.dataset.title;
  sectionBadge.textContent = slide.dataset.section;
  progressText.textContent = `${currentSlide + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  prevButton.disabled = currentSlide === 0;
  nextButton.disabled = currentSlide === slides.length - 1;
  window.history.replaceState(null, "", `#${currentSlide + 1}`);
  closeModals();
}

function closeModals() {
  infoModal.hidden = true;
  mapModal.hidden = true;
}

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showSlide(Number(button.dataset.go)));
});

prevButton.addEventListener("click", () => showSlide(currentSlide - 1));
nextButton.addEventListener("click", () => showSlide(currentSlide + 1));
document.getElementById("mapButton").addEventListener("click", () => { mapModal.hidden = false; });

document.querySelectorAll("[data-modal-title]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = button.dataset.modalTitle;
    document.getElementById("modalText").textContent = button.dataset.modalText;
    infoModal.hidden = false;
  });
});

document.querySelectorAll("[data-full-content]").forEach((button) => {
  button.addEventListener("click", () => {
    const template = document.getElementById(`content-${button.dataset.fullContent}`);
    if (!template) return;
    document.getElementById("modalTitle").textContent = template.dataset.title || "Desarrollo completo";
    const characters = (template.dataset.characters || "").split(",").map((name) => name.trim()).filter(Boolean);
    const characterMarkup = characters.map((name) => {
      const label = characterLabels[name] || name;
      return `<figure class="modal-character-card"><img src="${name}.svg" alt="${label}"><figcaption>${label}</figcaption></figure>`;
    }).join("");
    document.getElementById("modalText").innerHTML = characterMarkup
      ? `<div class="modal-full-content"><aside class="modal-characters">${characterMarkup}</aside><div class="modal-copy">${template.innerHTML}</div></div>`
      : template.innerHTML;
    infoModal.hidden = false;
  });
});

document.querySelectorAll(".flipcard").forEach((card) => {
  card.addEventListener("click", () => card.classList.toggle("flipped"));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModals));
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (event) => { if (event.target === modal) closeModals(); });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModals();
  if (!infoModal.hidden || !mapModal.hidden) return;
  if (event.key === "ArrowRight") showSlide(currentSlide + 1);
  if (event.key === "ArrowLeft") showSlide(currentSlide - 1);
});

window.addEventListener("hashchange", () => showSlide(getHashSlide()));

showSlide(getHashSlide());
