
onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);

  // Smooth scroll button
  const scrollBtn = document.querySelector('.scroll-down-btn');
  const targetSection = document.querySelector('.message-section');

  if (scrollBtn && targetSection) {
    scrollBtn.addEventListener('click', () => {
      const top = targetSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // Fade-in on scroll for message content
  const messageContent = document.getElementById('messageContent', 'signature');
  if (messageContent) {
    // Split paragraphs into words for stagger animation
    const allParagraphs = Array.from(messageContent.querySelectorAll('p'));
    const mainParagraphs = allParagraphs.filter(p => !p.closest('.signature'));
    const signatureParagraphs = allParagraphs.filter(p => p.closest('.signature'));

  const WORD_DELAY = 0.10; // seconds per word delay (slowed down from 0.06)
  const SIGNATURE_EXTRA_GAP = 0.6; // slightly longer pause after main text

    let totalMainWords = 0;

    const processParagraphs = (paragraphs, baseOffsetSeconds = 0) => {
      paragraphs.forEach(p => {
        if (p.dataset.wordsProcessed) return;
        const original = p.textContent.trim().replace(/\s+/g, ' ');
        if (!original) return;
        const words = original.split(' ');
        p.textContent = '';
        words.forEach((w, idx) => {
          const span = document.createElement('span');
            span.className = 'word';
            span.textContent = w + (idx < words.length - 1 ? ' ' : '');
            const delay = baseOffsetSeconds + idx * WORD_DELAY;
            span.style.transitionDelay = delay + 's';
            p.appendChild(span);
        });
        p.dataset.wordsProcessed = 'true';
        if (!p.closest('.signature')) totalMainWords += words.length;
      });
    };

    // Process main paragraphs first (accumulating word count)
    processParagraphs(mainParagraphs, 0);

    // Signature offset starts after last main word + gap
    const signatureBase = totalMainWords * WORD_DELAY + SIGNATURE_EXTRA_GAP;
    processParagraphs(signatureParagraphs, signatureBase);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          messageContent.classList.add('revealed');
          observer.unobserve(entry.target); // only once
        }
      });
    }, {
      threshold: 0.2
    });
    observer.observe(messageContent);
  }
};
  