function validateHTML(html, rules) {
    let results = { passed: [], failed: [] };

    rules.requiredTags.forEach(tag => {
        if (html.includes(`<${tag}`)) results.passed.push(`Tag <${tag}> encontrada.`);
        else results.failed.push(`Tag <${tag}> não encontrada.`);
    });

    rules.forbiddenTags.forEach(tag => {
        if (html.includes(`<${tag}`)) results.failed.push(`Tag proibida <${tag}> encontrada.`);
        else results.passed.push(`Tag proibida <${tag}> não encontrada.`);
    });

    return results;
}

module.exports = validateHTML;