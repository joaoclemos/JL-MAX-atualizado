const { execSync } = require('child_process');

function getGitBranches() {
    return execSync('git branch --format="%(refname:short)"')
        .toString()
        .trim()
        .split('\n');
}

function getGitCommitCount() {
    return parseInt(execSync('git rev-list --count HEAD').toString().trim(), 10);
}

function getGitMerges() {
    return execSync('git log --merges --pretty=format:"%H"')
        .toString()
        .trim()
        .split('\n')
        .filter(hash => hash);
}

function getGitLinesChanged() {
    return parseInt(
        execSync('git log --pretty=tformat: --numstat | awk \'{sum+=$1+$2} END {print sum}\'')
            .toString()
            .trim(),
        10
    );
}

// função para identificar itens no arquivo .gitingnore
function getGitIgnore() {
    return execSync('cat .gitignore')
        .toString()
        .trim()  
        .split('\n')
        .filter(item => item);
}

// função para obter a lista completa de arquivos na branch master
function getGitFiles() {
    return execSync('git ls-tree --name-only -r HEAD')
        .toString()
        .trim()
        .split('\n')
        .filter(file => file);
}

function validateGit(rules) {
    let results = { passed: [], failed: [] };

    // Verifica branches obrigatórias
    const branches = getGitBranches();
    rules.requiredBranches.forEach(branch => {
        if (branches.includes(branch)) {
            results.passed.push(`Branch '${branch}' encontrada.`);
        } else {
            results.failed.push(`Branch '${branch}' não encontrada.`);
        }
    });

    // Verifica quantidade minima de commits
    const commitCount = getGitCommitCount();
    if (commitCount < rules.minCommits) {
        results.failed.push(`Quantidade de commits (${commitCount}) abaixo do mínimo esperado (${rules.minCommits}).`);
    } else {
        results.passed.push(`Quantidade de commits (${commitCount}) dentro do esperado.`);
    }

    // Verifica merges sem fast-forward e quantidade mínima de merges
    const merges = getGitMerges();
    if (rules.forbidNoFFMerge) {
        if (merges.length > 0) {
            results.failed.push(`Foram encontrados ${merges.length} merges no histórico. Verifique se foram revisados corretamente.`);
        } else {
            results.passed.push(`Nenhum merge sem fast-forward detectado.`);
        }
    }
    if (merges.length < rules.minMerges) {
        results.failed.push(`Quantidade de merges (${merges.length}) abaixo do mínimo esperado (${rules.minMerges}).`);
    }
    else {
        results.passed.push(`Quantidade de merges (${merges.length}) dentro do esperado.`);
    }

    // Verifica quantidade mínima de linhas alteradas no histórico
    const linesChanged = getGitLinesChanged();
    if (linesChanged < rules.minLinesChanged) {
        results.failed.push(`Quantidade de linhas alteradas (${linesChanged}) abaixo do mínimo esperado (${rules.minLinesChanged}).`);
    }  
    else {
        results.passed.push(`Quantidade de linhas alteradas (${linesChanged}) dentro do esperado.`);
    }

    // Verifica itens constantes do gitignore
    const gitIgnore = getGitIgnore();
    rules.requiredGitIgnoreEntries.forEach(item => {
        if (gitIgnore.includes(item)) {
            results.passed.push(`Item '${item}' encontrado no .gitignore.`);
        } else {
            results.failed.push(`Item '${item}' não encontrado no .gitignore.`);
        }
    });

    // Verifica arquivos obrigatórios na branch master
    const files = getGitFiles();
    rules.requiredFiles.forEach(file => {
        if (files.includes(file)) {
            results.passed.push(`Arquivo '${file}' encontrado na branch master.`);
        } else {
            results.failed.push(`Arquivo '${file}' não encontrado na branch master.`);
        }
    });

    return results;
}

module.exports = validateGit;
