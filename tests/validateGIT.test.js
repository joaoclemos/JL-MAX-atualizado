const { validateGitRepo } = require('./validator');

describe("Validação de Histórico Git", () => {
    test("Verifica conformidade do repositório Git", () => {
        const result = validateGitRepo();

        console.log("Resultados Git:", result);

        expect(result.failed.length).toBe(0);
    });
});
