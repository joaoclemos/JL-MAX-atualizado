function extractSelectors(cssString) {
    // Expressão regular para capturar os seletores CSS
    const regex = /([^{\s][^{}]*?)\s*{[^}]*}/g;
    let selectors = [];
    let match;

    // Enquanto encontrar correspondências no CSS
    while ((match = regex.exec(cssString)) !== null) {
        // match[1] contém o seletor
        selectors.push(match[1].trim());
    }

    return selectors;
}

function extractPropertiesAndValues(cssString) {
    // Expressão regular para capturar as propriedades e valores dentro das regras CSS
    const regex = /([^{\s][^{}]*?)\s*{([^}]*)}/g;
    let properties = [];
    let match;

    // Enquanto encontrar correspondências no CSS
    while ((match = regex.exec(cssString)) !== null) {
        const ruleContent = match[2].trim(); // O conteúdo das declarações de estilo
        const declarations = ruleContent.split(';').filter(Boolean); // Separa as declarações

        declarations.forEach(declaration => {
            const [property, value] = declaration.split(':').map(part => part.trim());
            if (property && value) {
                properties.push({ property, value });
            }
        });
    }

    return properties;
}


function validateCSS(css, rules) {
    let results = { passed: [], failed: [] };

    //console.log ("css: ", css);

    // remove todo o conteúdo de comentários do css, quebras de linha e espaços em branco
    css = css.replace(/\/\*.*?\*\//g, '');
    css = css.replace(/\n/g, '');
    css = css.replace(/\s/g, '');

    // avalia o texto css e extrai os seletores e propriedades
    const selectors = extractSelectors(css);
    const properties = extractPropertiesAndValues(css);

    console.log ("seletores: ", selectors);
    console.log ("props: ", properties); 


    rules.requiredSelectors.forEach(selector => {
        if (selectors.includes(selector)) results.passed.push(`Seletor ${selector} encontrado.`);
        else results.failed.push(`Seletor ${selector} não encontrado.`);
    });

    rules.requiredProperties.forEach(property => {
        if (properties.some(prop => prop.property === property)) results.passed.push(`Propriedade ${property} encontrada.`);
        else results.failed.push(`Propriedade ${property} não encontrada.`);
    });

    rules.forbiddenProperties.forEach(property => {
        if (properties.some(prop => prop.property === property)) results.failed.push(`Propriedade proibida ${property} encontrada.`);
        else results.passed.push(`Propriedade proibida ${property} não encontrada.`);
    });

    return results;
}

module.exports = validateCSS;