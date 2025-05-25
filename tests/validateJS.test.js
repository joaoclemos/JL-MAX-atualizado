const { validateJSFile } = require('./validator');

describe("Validação de JavaScript", () => {
    test("Verifica conformidade do JavaScript", () => {
        const result = validateJSFile();

        console.log("Resultados JS:", result);

        expect(result.failed.length).toBe(0);
    });
});