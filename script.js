/* ==========================================================================
   NAHOMIE & LOVENSKY — ELECTRONIC WEDDING INVITATION
   JavaScript: Exclusive MP3 Audio Player ("Christina Perri - A Thousand Years") & Reveal Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));


  /* ------------------------------------------------------------------------
     2. LECTEUR AUDIO MP3 EXCLUSIF (Bouton Rond Parfait)
        Musique : Christina Perri - A Thousand Years (Piano/Cello Cover)
     ------------------------------------------------------------------------ */
  const musicBtn = document.getElementById('musicBtn');
  const musicBtnText = musicBtn ? musicBtn.querySelector('.music-btn-text') : null;
  const bgAudio = document.getElementById('bgAudio');

  let isPlaying = false;

  if (musicBtn && bgAudio) {
    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        bgAudio.play().then(() => {
          isPlaying = true;
          musicBtn.classList.add('playing');
          if (musicBtnText) musicBtnText.innerHTML = 'PAUSE';
        }).catch(err => {
          console.error("Erreur lors de la lecture du fichier MP3:", err);
        });
      } else {
        bgAudio.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        if (musicBtnText) musicBtnText.innerHTML = 'JOUER<br>LA MUSIQUE';
      }
    });
  }

});
