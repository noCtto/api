import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // Key configurations for Stress in this section
  stages: [
    { duration: '10s', target: 100 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '10s', target: 300 }, // stay at higher 200 users for 30 minutes
    { duration: '15s', target: 500 }, // stay at higher 200 users for 30 minutes
    { duration: '10s', target: 350 }, // stay at higher 200 users for 30 minutes
    { duration: '10s', target: 100 }, // stay at higher 200 users for 30 minutes
    
  ],
};

export default () => {
  const urlRes = http.get('http://localhost:4000');
  sleep(1);
  // MORE STEPS
  // Here you can have more steps or complex script
  // Step1
  // Step2
  // etc.
};