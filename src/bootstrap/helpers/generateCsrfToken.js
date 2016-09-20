import randomString from 'randomstring';

export default function generateCsrfToken() {
  randomString.generate(32);
};
