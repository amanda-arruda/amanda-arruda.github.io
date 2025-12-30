const container = document.querySelector('.container');
const cards = Array.from(container.children);

const tagFilter = document.getElementById('tagFilter');
const authorSort = document.getElementById('authorSort');
const yearSort = document.getElementById('yearSort');

function applyFilters() {
    const selectedTag = tagFilter.value;

    cards.forEach(card => {
        const tags = card.dataset.tags || '';
        const show = !selectedTag || tags.includes(selectedTag);
        card.style.display = show ? '' : 'none';
    });
}

function sortCards() {
    let sortedCards = [...cards];

    if (authorSort.value === 'asc') {
        sortedCards.sort((a, b) =>
            a.dataset.author.localeCompare(b.dataset.author)
        );
    }

    if (yearSort.value === 'asc') {
        sortedCards.sort((a, b) =>
            Number(a.dataset.year) - Number(b.dataset.year)
        );
    }

    sortedCards.forEach(card => container.appendChild(card));
}

tagFilter.addEventListener('change', applyFilters);
authorSort.addEventListener('change', sortCards);
yearSort.addEventListener('change', sortCards);

document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".container .card"));

  const chipsAuthor = document.getElementById("chips-author");
  const chipsTag = document.getElementById("chips-tag");
  const chipsYear = document.getElementById("chips-year");
  const resetBtn = document.getElementById("filter-reset");

  const state = {
    author: "",   // empty means "All"
    tag: "",
    year: ""
  };

  const norm = (s) => (s || "").trim();
  const key = (s) => norm(s).toLowerCase();

  // Collect unique values from cards
  const authors = new Set();
  const tags = new Set();
  const years = new Set();

  cards.forEach((card) => {
    const a = norm(card.dataset.author);
    const y = norm(card.dataset.yearRead);
    const tList = (card.dataset.tags || "")
      .split(",")
      .map(norm)
      .filter(Boolean);

    if (a) authors.add(a);
    if (y) years.add(y);
    tList.forEach((t) => tags.add(t));
  });

  function buildChips(container, values, type) {
    container.innerHTML = "";

    // Add "All" chip
    container.appendChild(makeChip("All", "", type));

    values
      .slice()
      .sort((a, b) => a.localeCompare(b))
      .forEach((val) => container.appendChild(makeChip(val, val, type)));

    // Set initial active chip
    setActiveChip(container, "");
  }

  function makeChip(label, value, type) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.textContent = label;
    btn.dataset.value = value;
    btn.dataset.type = type;

    btn.addEventListener("click", () => {
      state[type] = value; // single-select
      setActiveChip(
        type === "author" ? chipsAuthor : type === "tag" ? chipsTag : chipsYear,
        value
      );
      applyFilters();
    });

    return btn;
  }

  function setActiveChip(container, value) {
    const v = key(value);
    container.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("active", key(chip.dataset.value) === v);
    });
  }

  function applyFilters() {
    const a = key(state.author);
    const t = key(state.tag);
    const y = key(state.year);

    cards.forEach((card) => {
      const cardAuthor = key(card.dataset.author);
      const cardYear = key(card.dataset.yearRead);
      const cardTags = (card.dataset.tags || "")
        .split(",")
        .map((x) => key(x));

      const matchesAuthor = !a || cardAuthor === a;
      const matchesYear = !y || cardYear === y;
      const matchesTag = !t || cardTags.includes(t);

      card.style.display = (matchesAuthor && matchesYear && matchesTag) ? "" : "none";
    });
  }

  resetBtn.addEventListener("click", () => {
    state.author = "";
    state.tag = "";
    state.year = "";

    setActiveChip(chipsAuthor, "");
    setActiveChip(chipsTag, "");
    setActiveChip(chipsYear, "");
    applyFilters();
  });

  // Build chips
  buildChips(chipsAuthor, Array.from(authors), "author");
  buildChips(chipsTag, Array.from(tags), "tag");
  buildChips(chipsYear, Array.from(years).sort((a, b) => Number(b) - Number(a)), "year");

  applyFilters();
});
