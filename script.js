// ── Page Configuration ──
// Each spread defines which right page flips, and which left page it reveals
const spreads = [
    { rightPage: 'turn-1', leftPage: null },        // Spread 1: flip reveals spread 2
    { rightPage: 'turn-2', leftPage: 'turn-2-left' }, // Spread 2: flip reveals spread 3
    { rightPage: 'turn-3', leftPage: 'turn-3-left' }, // Spread 3: flip reveals spread 4
    { rightPage: 'turn-4', leftPage: 'turn-4-left' }, // Spread 4: back cover
];

// Track current spread (0-indexed)
let currentSpread = 0;

// ── Flip Forward ──
function flipForward() {
    if (currentSpread >= spreads.length - 1) return;

    const current = spreads[currentSpread];
    const next = spreads[currentSpread + 1];

    // Flip current right page over
    const rightPage = document.getElementById(current.rightPage);
    rightPage.classList.add('turn');

    // After flip completes, drop its z-index below the left page
    // setTimeout(() => {
    //     rightPage.style.zIndex = 0;
    // }, 1000);

    // Reveal next left page
    if (next.leftPage) {
        const leftPage = document.getElementById(next.leftPage);
        leftPage.style.visibility = 'visible';
    }

    currentSpread++;
}

// ── Flip Backward ──
function flipBackward() {
    if (currentSpread <= 0) return;

    const current = spreads[currentSpread];
    const prev = spreads[currentSpread - 1];

    // Flip previous right page back
    const rightPage = document.getElementById(prev.rightPage);
    rightPage.classList.remove('turn');
    // rightPage.style.zIndex = '';

    // Hide current left page
    if (current.leftPage) {
        const leftPage = document.getElementById(current.leftPage);
        setTimeout(() => {
            leftPage.style.visibility = 'hidden';
        }, 1000);
    }

    currentSpread--;
}

// ── Attach Chevron Clicks ──
document.querySelectorAll('.nextprev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('next')) {
            flipForward();
        } else if (btn.classList.contains('back')) {
            flipBackward();
        }
    });
});

// ── Reveal Book on Load ──
window.addEventListener('load', () => {
    const book = document.querySelector('.book');
    book.style.visibility = 'visible';
});