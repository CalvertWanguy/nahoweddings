/* ==========================================================================
   NAHOMIE & LOVENSKY — ELECTRONIC WEDDING INVITATION
   JavaScript: Music Player, Web Audio Synthesizer Fallback, Scroll Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
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

  // Web Audio Synthesizer for soothing romantic chord progression if MP3 isn't available
  function playAmbientSynthesizer() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // F Major / D Minor romantic pentatonic chord notes (Hz)
    const notes = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25];

    function triggerNote() {
      if (!isPlaying || !audioCtx) return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Soft envelope (slow attack and release)
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

  // Toggle Play / Pause
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        // Try playing HTML5 Audio element first
        if (bgAudio && bgAudio.src && bgAudio.src.length > 0) {
          bgAudio.play().then(() => {
            isPlaying = true;
            updateBtnState(true);
          }).catch(err => {
            console.log('Audio file play fallback to Web Audio Synth:', err);
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
      if (musicBtnText) musicBtnText.textContent = 'Pause';
    } else {
      musicBtn.classList.remove('playing');
      if (musicBtnText) musicBtnText.textContent = 'Jouer la musique';
    }
  }

});
