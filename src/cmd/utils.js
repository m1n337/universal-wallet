export const passwordQuestions = [
  {
    type: 'password',
    message: 'Enter your password:',
    name: 'password',
    mask: '*',
    validate(value) {
      if (value.length < 6) {
        return 'Password should be at least 6 characters.';
      }
      return true;
    },
  },
  {
    type: 'password',
    name: 'confirmPassword',
    message: 'Confirm your password:',
    mask: '*',
    validate(value, answers) {
      if (value !== answers.password) {
        return 'Passwords do not match.';
      }
      return true;
    },
  },
];
