import isEmpty from 'is-empty';

const allowedFieldsIdentifier = (fields = [], data = {}) => {
    let allowedFields = {}
    Object.keys(data).forEach(field => {
        if (fields.includes(field) && isEmpty(data[field])) {
            allowedFields[field] = 'El campo no puede estar vacío';
        };
        if (!fields.includes(field)) {
            allowedFields[field] = 'El campo no esta permitido';
        };
    });
    return allowedFields;
}
export default allowedFieldsIdentifier;