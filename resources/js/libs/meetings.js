import axios from 'axios';

export function updateMeetingStatus(meetingId, status) {
  return axios.post(`/meetings/${meetingId}/status`, { status });
}
