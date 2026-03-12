// ── Page Configuration ──
// Pages in order — each flips to reveal its back face
const pages = ['turn-1', 'turn-2', 'turn-3', 'turn-4'];
let currentPage = 0;

// ── Flip Forward ──
function flipForward() {
    if (currentPage >= pages.length) return;
    const page = document.getElementById(pages[currentPage]);
    page.classList.add('turn');
    // Bring flipped page above unflipped pages
    page.style.zIndex = 10 + currentPage;
    currentPage++;
}

// ── Flip Backward ──
function flipBackward() {
    if (currentPage <= 0) return;
    currentPage--;
    const page = document.getElementById(pages[currentPage]);
    page.classList.remove('turn');
    page.style.zIndex = 4 - currentPage;
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

// ── Scale wrapper to fit viewport ──
function scaleWrapper() {
    const wrapper = document.querySelector('.wrapper');
    const scaleX = (window.innerWidth * 0.95) / wrapper.offsetWidth;
    const scaleY = (window.innerHeight * 0.95) / wrapper.offsetHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'center center';
}

scaleWrapper();
window.addEventListener('resize', scaleWrapper);