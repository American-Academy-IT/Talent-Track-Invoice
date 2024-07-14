export const VALIDATE_USERNAME = (username, min = 5, max = 16) => {
  if (!username) {
    return 'Required';
  }
  if (username.trim().length < min) {
    return `Username must be at least ${min} letters.`;
  }
  if (username.trim().length > max) {
    return 'Password is too long.';
  }
};

export const VALIDATE_PASSWORD = (password, min = 6, max = 16) => {
  if (!password) {
    return 'Required';
  }
  if (password.trim().length < min) {
    return `Password must be at least ${min} letters.`;
  }
  if (password.trim().length > max) {
    return 'Password is too long.';
  }
};

export const RANGE_NUMBER = (num, min = 0, max = 999) => {
  if (min > num || num > max) {
    return `Number must be in range [${min} - ${max}]`;
  }
};

export const VALIDATE_TEXT = (name, min = 5, max = 100) => {
  const trimed_name = name.trim();

  if (!trimed_name) {
    return 'Invalid Name';
  }
  if (trimed_name.length < 5) {
    return `Name must be at least ${min} characters long.`;
  }
  if (trimed_name.length > max) {
    return 'Name is too long.';
  }
};
