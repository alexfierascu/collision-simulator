import { recordingState, resetRecordingState } from './RecordingState.js';
import { state } from '../state/SimulationState.js';
import { getStarfieldCanvas } from '../rendering/StarfieldRenderer.js';
import { showToast } from '../ui/Toast.js';
import { $ } from '../ui/dom.js';
import { trackAction } from '../achievements/Achievements.js';

let compositeCanvas = null;
let compositeCtx = null;
let stopTimeout = null;

function getCodec() {
  const codecs = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  for (const codec of codecs) {
    if (MediaRecorder.isTypeSupported(codec)) return codec;
  }
  return null;
}

function ensureCompositeCanvas() {
  if (!compositeCanvas) {
    compositeCanvas = document.createElement('canvas');
  }
  compositeCanvas.width = state.canvas.width;
  compositeCanvas.height = state.canvas.height;
  compositeCtx = compositeCanvas.getContext('2d');
}

export function compositeFrame() {
  if (!recordingState.isRecording || !compositeCtx) return;

  const w = compositeCanvas.width;
  const h = compositeCanvas.height;
  compositeCtx.clearRect(0, 0, w, h);

  // Draw starfield layer if available
  const starfield = getStarfieldCanvas();
  if (starfield) {
    compositeCtx.drawImage(starfield, 0, 0, w, h);
  }

  // Draw simulation canvas on top
  compositeCtx.drawImage(state.canvas, 0, 0, w, h);
}

export function toggleRecording() {
  if (recordingState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  if (!state.canvas || !state.canvas.captureStream) {
    showToast('Recording not supported in this browser');
    return;
  }

  const codec = getCodec();
  if (!codec) {
    showToast('No supported video codec found');
    return;
  }

  ensureCompositeCanvas();

  const stream = compositeCanvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: codec });

  recordingState.chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordingState.chunks.push(e.data);
  };
  recorder.onstop = onRecordingStop;

  recorder.start();
  recordingState.mediaRecorder = recorder;
  recordingState.isRecording = true;
  recordingState.startTime = Date.now();

  trackAction('record');
  updateRecordingUI(true);

  // Auto-stop after duration
  stopTimeout = setTimeout(() => {
    if (recordingState.isRecording) stopRecording();
  }, recordingState.duration);
}

function stopRecording() {
  if (stopTimeout) {
    clearTimeout(stopTimeout);
    stopTimeout = null;
  }
  if (recordingState.mediaRecorder && recordingState.mediaRecorder.state !== 'inactive') {
    recordingState.mediaRecorder.stop();
  }
  recordingState.isRecording = false;
  updateRecordingUI(false);
}

function onRecordingStop() {
  const blob = new Blob(recordingState.chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `collision-spawner-${Date.now()}.webm`;
  a.click();
  URL.revokeObjectURL(url);

  resetRecordingState();
  showToast('Recording saved!');
}

function updateRecordingUI(active) {
  const indicator = $('recordingIndicator');
  const btn = $('recordBtn');
  if (indicator) indicator.classList.toggle('active', active);
  if (btn) {
    btn.textContent = active ? '⏹ Stop' : '⏺ Record';
    btn.classList.toggle('active', active);
  }
}

export function updateRecordingCountdown() {
  if (!recordingState.isRecording) return;
  const indicator = $('recordingIndicator');
  if (!indicator) return;

  const elapsed = Date.now() - recordingState.startTime;
  const remaining = Math.max(0, Math.ceil((recordingState.duration - elapsed) / 1000));
  indicator.textContent = `REC ${remaining}s`;
}
