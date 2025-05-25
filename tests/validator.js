const fs = require('fs');
const path = require('path');

const validateHTML = require('./validateHTML');
const validateCSS = require('./validateCSS');
const validateJS = require('./validateJS');
const validateGit = require('./validateGIT');

function loadFile(filePath) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '';
}

function loadDescriptor() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../test-config.json'), 'utf-8'));
}

function validateHTMLFile() {
    const descriptor = loadDescriptor();
    const html = loadFile(path.join(__dirname, '../public/index.html'));
    return validateHTML(html, descriptor.html);
}

function validateCSSFile() {
    const descriptor = loadDescriptor();
    const css = loadFile(path.join(__dirname, '../public/style.css'));
    return validateCSS(css, descriptor.css);
}

function validateJSFile() {
    const descriptor = loadDescriptor();
    const js = loadFile(path.join(__dirname, '../public/app.js'));
    return validateJS(js, descriptor.js);
}

function validateGitRepo() {
    const descriptor = loadDescriptor();
    return validateGit(descriptor.git);
}

module.exports = {
    validateHTMLFile,
    validateCSSFile,
    validateJSFile,
    validateGitRepo
};
