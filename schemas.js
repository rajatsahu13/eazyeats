const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()
})

module.exports.bookingSchema = Joi.object({
    date: Joi.date().required(),
    guests: Joi.number().required().min(1).max(10),
    firstname: Joi.string().required().escapeHTML(),
    lastname: Joi.string().escapeHTML(),
    email: Joi.string().required().email({ minDomainSegments: 2 }).escapeHTML(),
    phone: Joi.number().required()
})