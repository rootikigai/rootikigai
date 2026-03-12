// ── Page Configuration ──
const pages = ['turn-1', 'turn-2', 'turn-3', 'turn-4'];
let currentPage = 0;
let isAnimating = false;

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
    if (btn.classList.contains('next')) {
      flipForward();
    } else if (btn.classList.contains('back')) {
      flipBackward();
    }
  });
});

// ── Contact Me Button ──
document.querySelector('.contact-me').addEventListener('click', (e) => {
  e.preventDefault();
  autoFlipTo(pages.length - 1);
});

// ── Back to Profile Button ──
document.querySelector('.back-profile').addEventListener('click', (e) => {
  e.preventDefault();
  autoFlipTo(0);
});

// ── Opening Animation ──
window.addEventListener('load', () => {
  const wrapper = document.querySelector('.wrapper');
  const book = document.querySelector('.book');
  const frontCover = document.querySelector('.cover-right');
  const backCover = document.querySelector('.cover-left');

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

// ── Scale wrapper to fit viewport ──
function scaleWrapper() {
  const wrapper = document.querySelector('.wrapper');
  const scaleX = (window.innerWidth * 0.95) / wrapper.offsetWidth;
  const scaleY = (window.innerHeight * 0.95) / wrapper.offsetHeight;
  const scale = Math.min(scaleX, scaleY, 1);
  wrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;
  wrapper.style.transformOrigin = 'center center';
}

scaleWrapper();
window.addEventListener('resize', scaleWrapper);