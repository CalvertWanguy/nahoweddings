/* ==========================================================================
   NAHOMIE & LOVENSKY — ELECTRONIC WEDDING INVITATION
   JavaScript: Music Player, Web Audio Synth Fallback, Reveal Animations
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
     2. AUDIO PLAYER & WEB AUDIO SYNTHESIZER FALLBACK
     ------------------------------------------------------------------------ */
  const musicBtn = document.getElementById('musicBtn');
  const musicBtnText = musicBtn ? musicBtn.querySelector('.music-btn-text') : null;
  const bgAudio = document.getElementById('bgAudio');

  let isPlaying = false;
  let audioCtx = null;
  let synthInterval = null;

  // Web Audio Synthesizer for ambient music
  function playAmbientSynthesizer() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];

    function triggerNote() {
      if (!isPlaying || !audioCtx) return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 4.6);
    }

    triggerNote();
    synthInterval = setInterval(triggerNote, 2200);
  }

  function stopAmbientSynthesizer() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        if (bgAudio && bgAudio.src && bgAudio.src.length > 0) {
          bgAudio.play().then(() => {
            isPlaying = true;
            updateBtnState(true);
          }).catch(() => {
            isPlaying = true;
            playAmbientSynthesizer();
            updateBtnState(true);
          });
        } else {
          isPlaying = true;
          playAmbientSynthesizer();
          updateBtnState(true);
        }
      } else {
        isPlaying = false;
        if (bgAudio) bgAudio.pause();
        stopAmbientSynthesizer();
        updateBtnState(false);
      }
    });
  }

  function updateBtnState(playing) {
    if (playing) {
      musicBtn.classList.add('playing');
      if (musicBtnText) musicBtnText.textContent = 'PAUSE';
    } else {
      musicBtn.classList.remove('playing');
      if (musicBtnText) musicBtnText.textContent = 'JOUER LA MUSIQUE';
    }
  }

});
