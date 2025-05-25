const { validateHTMLFile } = require('./validator');

describe("Validação de HTML", () => {
    test("Verifica conformidade do HTML", () => {
        const result = validateHTMLFile();

        console.log("Resultados HTML:", result);

        expect(result.failed.length).toBe(0);
    });
});