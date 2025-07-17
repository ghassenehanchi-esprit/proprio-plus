import axios from 'axios';

export function updateMeetingStatus(meetingId, status) {
  return axios.get(`/meetings/${meetingId}/status/${status}`);
}
