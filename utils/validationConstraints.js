// validation
import { validate } from 'validate.js';

export const validateString = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
  };

  if (value !== '') {
    constraints.format = {
      pattern: '[a-z]+',
      flags: 'i',
      message: 'can only contain letters',
    };
  }

  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // if valid => undefined
  // if not valid => array of validation problems

  return validationResult && validationResult[id];
};

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
  const constraints = {
    presence: {
      allowEmpty: allowEmpty,
      message: 'is required',
    },
  };

  if (!allowEmpty || value !== '') {
    constraints.length = {};
    if (minLength != null) {
      constraints.length.minimum = minLength;
    }
    if (maxLength != null) {
      constraints.length.maximum = maxLength;
    }
  }

  const validationResult = validate({ [id]: value }, { [id]: constraints });
  // if valid => undefined
  // if not valid => array of validation problems

  return validationResult && validationResult[id];
};

export const validateEmail = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
  };

  if (value !== '') {
    constraints.email = {
      message: 'is not valid',
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validatePassword = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: 'is required',
    },
  };

  if (value !== '') {
    constraints.length = {
      minimum: 6,
      message: 'must be at least 6 characters long',
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};
