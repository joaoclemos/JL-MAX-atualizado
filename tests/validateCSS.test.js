const { validateCSSFile } = require('./validator');

describe("Validação de CSS", () => {
    test("Verifica conformidade do CSS", () => {
        const result = validateCSSFile();

        console.log("Resultados CSS:", result);

        expect(result.failed.length).toBe(0);
    });
});