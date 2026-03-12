// ── Mobile Detection ──
function isMobile() {
  return window.innerWidth <= 768;
}

// ── Page Configuration ──
const pages = ['turn-1', 'turn-2', 'turn-3', 'turn-4'];
let currentPage = 0;
let isAnimating = false;

// ── Mobile Page Faces (in order) ──
const mobileFaces = [
  { page: 'turn-1', face: 'front' },
  { page: 'turn-1', face: 'back' },
  { page: 'turn-2', face: 'front' },
  { page: 'turn-2', face: 'back' },
  { page: 'turn-3', face: 'front' },
  { page: 'turn-3', face: 'back' },
  { page: 'turn-4', face: 'front' },
];
let currentFace = 0;

// ── Mobile: Show Face ──
function showFace(index) {
  // Hide all page faces
  document.querySelectorAll('.book-page').forEach(p => {
    p.style.display = 'none';
  });

  const target = mobileFaces[index];
  if (!target) return;

  const pageEl = document.getElementById(target.page);
  if (!pageEl) return;

  pageEl.style.display = 'block';

  // Show correct face
  const front = pageEl.querySelector('.page-front');
  const back = pageEl.querySelector('.page-back');

  if (target.face === 'front') {
    if (front) front.style.display = 'block';
    if (back) back.style.display = 'none';
  } else {
    if (front) front.style.display = 'none';
    if (back) back.style.display = 'block';
  }
}

// ── Mobile: Navigate Forward ──
function mobileNext() {
  if (currentFace >= mobileFaces.length - 1) return;
  currentFace++;
  showFace(currentFace);
}

// ── Mobile: Navigate Backward ──
function mobilePrev() {
  if (currentFace <= 0) return;
  currentFace--;
  showFace(currentFace);
}

// ── Mobile: Auto Navigate to Face ──
function mobileAutoTo(targetFace) {
  currentFace = targetFace;
  showFace(currentFace);
}

// ── Flip Forward ──
function flipForward() {
  if (currentPage >= pages.length || isAnimating) return;
  isAnimating = true;

  const page = document.getElementById(pages[currentPage]);
  page.style.zIndex = 10;
  page.classList.add('turn');
  currentPage++;

  setTimeout(() => { isAnimating = false; }, 1000);
}

// ── Flip Backward ──
function flipBackward() {
  if (currentPage <= 0 || isAnimating) return;
  isAnimating = true;

  currentPage--;
  const page = document.getElementById(pages[currentPage]);
  page.style.zIndex = 10;

  setTimeout(() => {
    page.classList.remove('turn');
    setTimeout(() => {
      page.style.zIndex = 4 - currentPage;
      isAnimating = false;
    }, 1000);
  }, 20);
}

// ── Auto Flip to Page ──
function autoFlipTo(targetIndex) {
  if (isAnimating) return;

  function flipStep() {
    if (currentPage === targetIndex) return;

    isAnimating = true;

    if (currentPage < targetIndex) {
      const page = document.getElementById(pages[currentPage]);
      page.style.zIndex = 10;
      page.classList.add('turn');
      currentPage++;
      setTimeout(() => {
        isAnimating = false;
        flipStep();
      }, 900);
    } else {
      currentPage--;
      const page = document.getElementById(pages[currentPage]);
      page.style.zIndex = 10;
      setTimeout(() => {
        page.classList.remove('turn');
        setTimeout(() => {
          page.style.zIndex = 4 - currentPage;
          isAnimating = false;
          flipStep();
        }, 900);
      }, 20);
    }
  }

  flipStep();
}

// ── Attach Chevron Clicks ──
document.querySelectorAll('.nextprev-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (isMobile()) {
      if (btn.classList.contains('next')) {
        mobileNext();
      } else if (btn.classList.contains('back')) {
        mobilePrev();
      }
    } else {
      if (btn.classList.contains('next')) {
        flipForward();
      } else if (btn.classList.contains('back')) {
        flipBackward();
      }
    }
  });
});

// ── Contact Me Button ──
document.querySelector('.contact-me').addEventListener('click', (e) => {
  e.preventDefault();
  if (isMobile()) {
    mobileAutoTo(mobileFaces.length - 1);
  } else {
    autoFlipTo(pages.length - 1);
  }
});

// ── Back to Profile Button ──
document.querySelector('.back-profile').addEventListener('click', (e) => {
  e.preventDefault();
  if (isMobile()) {
    mobileAutoTo(0);
  } else {
    autoFlipTo(0);
  }
});

// ── Opening Animation ──
window.addEventListener('load', () => {
  const wrapper = document.querySelector('.wrapper');
  const book = document.querySelector('.book');
  const frontCover = document.querySelector('.cover-right');
  const backCover = document.querySelector('.cover-left');

  if (isMobile()) {
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'none';
    book.style.visibility = 'visible';
    document.querySelectorAll('.book-page').forEach(p => {
      p.style.display = 'none';
    });
    showFace(0);
    return;
  }

  wrapper.style.opacity = '0';
  wrapper.style.transition = 'none';
  wrapper.style.transform = 'translate(-150%, -50%)';
  backCover.style.opacity = '0';

  document.querySelectorAll('.book-page').forEach(page => {
    page.style.visibility = 'hidden';
  });

  frontCover.style.transformOrigin = 'left center';
  frontCover.style.transform = 'rotateY(0deg)';
  frontCover.style.transition = 'none';
  frontCover.style.zIndex = '10';

  setTimeout(() => {
    // Step 1: slide in closed to center
    wrapper.style.transition = 'transform 1s ease, opacity 0.5s ease';
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
      // Step 2: open cover and reveal profile page
      frontCover.style.transition = 'transform 1s ease';
      frontCover.style.transform = 'rotateY(-180deg)';
      document.getElementById('turn-1').style.visibility = 'visible';

      setTimeout(() => {
        backCover.style.opacity = '1';
      }, 1000);

      setTimeout(() => {
        document.querySelectorAll('.book-page').forEach(page => {
          page.style.visibility = 'visible';
        });
        scaleWrapper();
      }, 1000);
    }, 1000);
  }, 300);
});

// ── Scale wrapper to fit viewport (desktop only) ──
function scaleWrapper() {
  if (isMobile()) return;
  const wrapper = document.querySelector('.wrapper');
  const scaleX = (window.innerWidth * 0.95) / wrapper.offsetWidth;
  const scaleY = (window.innerHeight * 0.95) / wrapper.offsetHeight;
  const scale = Math.min(scaleX, scaleY, 1);
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
  wrapper.style.transformOrigin = 'center center';
}

scaleWrapper();
window.addEventListener('resize', () => {
  if (isMobile()) {
    showFace(currentFace);
  } else {
    scaleWrapper();
  }
});