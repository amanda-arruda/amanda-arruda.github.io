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