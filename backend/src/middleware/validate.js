const Joi = require('joi');

// Define validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long.',
      'any.required': 'Password is required.'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address.',
      'any.required': 'Email is required.'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required.'
    })
  }),

  project: Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      'string.min': 'Project name must be at least 3 characters.',
      'string.max': 'Project name cannot exceed 100 characters.',
      'any.required': 'Project name is required.'
    }),
    description: Joi.string().max(500).allow('').required().messages({
      'string.max': 'Description cannot exceed 500 characters.',
      'any.required': 'Description is required.'
    })
  }),

  task: Joi.object({
    title: Joi.string().min(2).max(150).required().messages({
      'string.min': 'Task title must be at least 2 characters.',
      'string.max': 'Task title cannot exceed 150 characters.',
      'any.required': 'Task title is required.'
    }),
    description: Joi.string().max(1000).allow('').required().messages({
      'string.max': 'Description cannot exceed 1000 characters.',
      'any.required': 'Description is required.'
    }),
    status: Joi.string().valid('todo', 'in-progress', 'done').messages({
      'any.only': 'Status must be one of: todo, in-progress, done.'
    }),
    assignedTo: Joi.string().max(100).allow('')
  })
};

// Middleware wrapper
const validate = (schemaName) => {
  return (req, res, next) => {
    if (!schemas[schemaName]) {
      return res.status(500).json({ error: `Validation schema "${schemaName}" does not exist.` });
    }

    const { error } = schemas[schemaName].validate(req.body, { abortEarly: false });
    if (error) {
      const errorDetails = error.details.map(d => d.message);
      return res.status(400).json({ errors: errorDetails, error: errorDetails[0] });
    }

    next();
  };
};

module.exports = validate;
