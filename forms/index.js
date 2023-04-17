// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;

const createProductForm = () => {
    return forms.create({
        "name": fields. string({
            required: true,
            errorAfterField: true
        }),
        "cost":fields.number({
            required: true,
            errorAfterField: true
        }),
        "description": fields.string({
            required: true,
            errorAfterField: true,
            widgets:forms.widgets.textarea()
        }),
    })
}
    
module.exports = {createProductForm}