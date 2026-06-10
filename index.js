document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. RETRO SYSTEM TRAY CLOCK
     ========================================================================== */
  const clockElement = document.getElementById('taskbar-clock');
  
  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Pad with leading zeros if necessary
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    clockElement.textContent = `${hours}:${minutes}`;
  }
  
  // Initial update and set interval
  updateClock();
  setInterval(updateClock, 10000); // Update every 10 seconds

  /* ==========================================================================
     2. RETRO WINDOW CONTROLS (MINIMIZE, MAXIMIZE, CLOSE)
     ========================================================================== */
  const cards = document.querySelectorAll('.slide-card');
  
  cards.forEach(card => {
    const body = card.querySelector('.window-body');
    const closeBtn = card.querySelector('.win-btn.close');
    const minimizeBtn = card.querySelector('.win-btn.minimize');
    const maximizeBtn = card.querySelector('.win-btn.maximize');
    
    // Close Window: Fade out and remove from display layout
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 400);
      });
    }
    
    // Minimize Window: Collapse the window body
    if (minimizeBtn && body) {
      minimizeBtn.addEventListener('click', () => {
        body.style.transition = 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1), padding 0.3s ease, opacity 0.2s ease';
        if (body.classList.contains('collapsed')) {
          body.classList.remove('collapsed');
          body.style.maxHeight = body.scrollHeight + 'px';
          body.style.opacity = '1';
          body.style.padding = '';
        } else {
          body.style.maxHeight = body.scrollHeight + 'px'; // Set current height to trigger transition
          // Force layout reflow
          body.offsetHeight;
          body.classList.add('collapsed');
          body.style.maxHeight = '0px';
          body.style.opacity = '0';
          body.style.paddingTop = '0px';
          body.style.paddingBottom = '0px';
        }
      });
    }
    
    // Maximize Window: Toggle full-viewport/expanded visual scaling
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => {
        card.classList.toggle('maximized');
        if (card.classList.contains('maximized')) {
          card.style.zIndex = '999';
        } else {
          card.style.zIndex = '';
        }
      });
    }
  });

  /* ==========================================================================
     3. SCROLL REVEAL & SKILLS PROGRESS ANIMATION
     ========================================================================== */
  // Store target skill bar widths so we can animate from 0% on reveal
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  skillFills.forEach(fill => {
    const targetWidth = fill.style.width;
    fill.style.width = '0%';
    fill.setAttribute('data-target-width', targetWidth);
  });

  // Intersection Observer for Slide Cards
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        
        // Trigger skills animation when skills section becomes visible
        if (entry.target.id === 'slide-skills') {
          skillFills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-target-width');
          });
        }
        
        // Once revealed, we can unobserve if we want one-time entrance
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  cards.forEach(card => {
    revealObserver.observe(card);
  });

  /* ==========================================================================
     4. STICKY TASKBAR ACTIVE STATES (SCROLL SPY)
     ========================================================================== */
  const taskLinks = document.querySelectorAll('.taskbar-middle .running-app');
  const sections = document.querySelectorAll('main > .slide-card');
  
  const spyOptions = {
    threshold: 0.3,
    rootMargin: '-20% 0px -40% 0px'
  };
  
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active state from all links
        taskLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, spyOptions);
  
  sections.forEach(section => {
    spyObserver.observe(section);
  });

  // Smooth scroll click handler for taskbar button links
  const allNavLinks = document.querySelectorAll('nav a, .contents-grid a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          // If the section was closed, show it again
          if (targetSection.style.display === 'none') {
            targetSection.style.display = 'flex';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0) scale(1)';
          }
          
          // If the section was minimized, expand it
          const body = targetSection.querySelector('.window-body');
          if (body && body.classList.contains('collapsed')) {
            body.classList.remove('collapsed');
            body.style.maxHeight = '';
            body.style.opacity = '1';
            body.style.padding = '';
          }
          
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
