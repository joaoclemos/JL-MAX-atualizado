function validateJS(js, rules) {
    let results = { passed: [], failed: [] };

    rules.requiredFunctions.forEach(func => {
        if (js.includes(func)) results.passed.push(`Uso de ${func} encontrado.`);
        else results.failed.push(`Uso de ${func} não encontrado.`);
    });

    rules.forbiddenFunctions.forEach(func => {
        if (js.includes(func)) results.failed.push(`Uso proibido de ${func} encontrado.`);
        else results.passed.push(`Uso proibido de ${func} não encontrado.`);
    });

    return results;
}

module.exports = validateJS;