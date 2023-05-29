const requiredFieldsIdentifier = (fields = [], data = {}) => {
    let requiredFields = {}
    fields.forEach(field => {
        if (!data.hasOwnProperty(field)) {
            requiredFields[field] = 'El campo es obligatorio';
        }
    });
    return requiredFields;
}
export default requiredFieldsIdentifier;