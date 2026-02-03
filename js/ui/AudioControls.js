import { $ } from './dom.js';
import { toggleMusic, changeMusicStyle, setVolume } from '../audio/AudioManager.js';

export function initAudioControls() {
  const musicBtn = $('musicBtn');
  const musicStyle = $('musicStyle');

  musicBtn.addEventListener('click', () => {
    toggleMusic(musicBtn, musicStyle);
  });

  musicStyle.addEventListener('change', (e) => {
    changeMusicStyle(e.target.value);
  });

  $('volumeSlider').addEventListener('input', (e) => {
    setVolume(e.target.value);
  });
}
