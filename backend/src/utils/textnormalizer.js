

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "") // space, dash, tab hatao
        .trim();
}

module.exports = normalizeText;
