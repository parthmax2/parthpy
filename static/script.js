const editor = CodeMirror(document.getElementById("code-editor"), {
    value: localStorage.getItem("userCode") || "print('Hello, World!')",
    mode: "python",
    theme: "dracula",
    lineNumbers: true,
});

editor.on("change", () => {
    localStorage.setItem("userCode", editor.getValue());
});

function runCode() {
    const userCode = editor.getValue();

    document.getElementById('output').innerHTML = '';

    fetch("/execute-python", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: userCode })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('output').innerHTML = `<div class="console-error">${data.error}</div>`;
        } else {
            document.getElementById('output').innerHTML = `<div>${data.output}</div>`;
        }
    })
    .catch(error => {
        document.getElementById('output').innerHTML = `<div class="console-error">Error: ${error.message}</div>`;
    });
}

function formatCode() {
    const formattedCode = prettier.format(editor.getValue(), {
        parser: "babel",
        plugins: prettierPlugins,
    });
    editor.setValue(formattedCode);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
