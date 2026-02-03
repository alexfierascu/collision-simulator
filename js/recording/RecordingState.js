export const recordingState = {
  isRecording: false,
  chunks: [],
  startTime: 0,
  duration: 5000,
  mediaRecorder: null,
};

export function resetRecordingState() {
  recordingState.isRecording = false;
  recordingState.chunks = [];
  recordingState.startTime = 0;
  recordingState.mediaRecorder = null;
}
