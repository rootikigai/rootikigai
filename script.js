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
function showFace(index, options) {
  const updateChrome = !options || options.updateChrome !== false;
  // Only the real book pages. A flying sheet lives outside .book.
  document.querySelectorAll('.book > .book-page').forEach(p => {
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

  if (updateChrome) updateJotterHint();
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function updateJotterHint() {
  const next = document.querySelector('.jotter-hint-next');
  const prev = document.querySelector('.jotter-hint-prev');
  const atEnd = currentFace >= mobileFaces.length - 1;
  const atStart = currentFace <= 0;
  if (next) {
    next.classList.toggle('is-done', atEnd);
    next.disabled = atEnd;
  }
  if (prev) {
    prev.classList.toggle('is-done', atStart);
    prev.disabled = atStart;
  }
  const pageNum = document.querySelector('.jotter-page-num');
  if (pageNum) pageNum.textContent = String(currentFace + 1);
}

function clearJotterSheets() {
  document.querySelectorAll('.jotter-stage').forEach(stage => stage.remove());
}

function faceElementFor(index) {
  const target = mobileFaces[index];
  if (!target) return null;
  const pageEl = document.getElementById(target.page);
  if (!pageEl) return null;
  return pageEl.querySelector(target.face === 'front' ? '.page-front' : '.page-back');
}

function visibleFaceElement() {
  return faceElementFor(currentFace);
}

function makeJotterStage(faceEl) {
  const stage = document.createElement('div');
  stage.className = 'jotter-stage';
  stage.setAttribute('aria-hidden', 'true');

  const sheet = document.createElement('div');
  sheet.className = 'jotter-sheet';

  const page = document.createElement('div');
  page.className = 'book-page';
  page.style.display = 'block';

  const face = faceEl.cloneNode(true);
  face.style.display = 'block';
  face.style.overflow = 'hidden';
  page.appendChild(face);
  sheet.appendChild(page);
  stage.appendChild(sheet);
  return { stage, sheet, face };
}

function whenJotterSettles(sheet, done) {
  const finish = (event) => {
    if (event && event.target !== sheet) return;
    if (sheet.dataset.done === '1') return;
    sheet.dataset.done = '1';
    sheet.removeEventListener('animationend', finish);
    done();
  };
  sheet.addEventListener('animationend', finish);
  setTimeout(() => finish(), 520);
}

// Flip up sends the current sheet up and away. Flip down is that motion reversed.
function jotterTo(nextIndex) {
  if (isAnimating) return;
  if (nextIndex < 0 || nextIndex >= mobileFaces.length || nextIndex === currentFace) return;

  if (prefersReducedMotion()) {
    currentFace = nextIndex;
    showFace(currentFace);
    return;
  }

  const forward = nextIndex > currentFace;
  const movingFace = forward ? visibleFaceElement() : faceElementFor(nextIndex);
  if (!movingFace) {
    currentFace = nextIndex;
    showFace(currentFace);
    return;
  }

  isAnimating = true;
  const { stage, sheet, face } = makeJotterStage(movingFace);

  if (forward) {
    document.body.appendChild(stage);
    face.scrollTop = movingFace.scrollTop;
    currentFace = nextIndex;
    showFace(currentFace, { updateChrome: false });
    requestAnimationFrame(() => sheet.classList.add('is-up'));
  } else {
    sheet.classList.add('is-down');
    document.body.appendChild(stage);
    face.scrollTop = movingFace.scrollTop;
  }

  whenJotterSettles(sheet, () => {
    if (!forward) {
      currentFace = nextIndex;
      showFace(currentFace, { updateChrome: false });
    }
    stage.remove();
    updateJotterHint();
    isAnimating = false;
  });
}

// ── Mobile: Navigate Forward ──
function mobileNext() {
  if (currentFace >= mobileFaces.length - 1) return;
  jotterTo(currentFace + 1);
}

// ── Mobile: Navigate Backward ──
function mobilePrev() {
  if (currentFace <= 0) return;
  jotterTo(currentFace - 1);
}

// ── Mobile: Auto Navigate to Face ──
function mobileAutoTo(targetFace) {
  clearJotterSheets();
  isAnimating = false;
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

// ── Jotter buttons (small screens). Scrolling must not turn the page. ──
const jotterNext = document.querySelector('.jotter-hint-next');
const jotterPrev = document.querySelector('.jotter-hint-prev');
if (jotterNext) {
  jotterNext.addEventListener('click', () => {
    if (!isMobile()) return;
    mobileNext();
  });
}
if (jotterPrev) {
  jotterPrev.addEventListener('click', () => {
    if (!isMobile()) return;
    mobilePrev();
  });
}

// ── Contact form ──
const contactForm = document.querySelector('.contact-box form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(contactForm);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:rootikigai@gmail.com?subject=${subject}&body=${body}`;
  });
}

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
let layoutIsMobile = isMobile();
window.addEventListener('resize', () => {
  const mobile = isMobile();
  const stages = document.querySelectorAll('.jotter-stage');
  if (stages.length) {
    stages.forEach(stage => stage.remove());
    isAnimating = false;
  }

  if (mobile) {
    showFace(currentFace);
  } else {
    if (layoutIsMobile) {
      isAnimating = false;
      document.querySelectorAll('.book-page').forEach(p => {
        p.style.display = '';
      });
      document.querySelectorAll('.page-front, .page-back').forEach(el => {
        el.style.display = '';
      });
    }
    scaleWrapper();
  }
  layoutIsMobile = mobile;
});