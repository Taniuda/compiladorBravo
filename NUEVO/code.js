// Definiciones de tokens
const tokenDefinitions = [
    { type: "palabraReservada", regex: /^(if|else)$/ },
    { type: "consoleCommand", regex: /^console\.writeline$/ },
    { type: "identificador", regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
    { type: "literalNumerica", regex: /^[0-9]+(\.[0-9]+)?$/ },
    { type: "literalCadena", regex: /^"([^"]*)"$/ }, // Aceptar espacios y caracteres especiales dentro de comillas
    { type: "operador", regex: /^(<|>|<=|>=|==|!=)$/ },
    { type: "delimitador", regex: /^[{}();]$/ },
    { type: "comentarioLinea", regex: /^\/\/.*$/ },
];

// Tokenización
function tokenize(code) {
    const lines = code.split("\n");
    const tokens = [];
    const errors = [];

    lines.forEach((line, lineNumber) => {
        const trimmedLine = line.trim();

        // Ignorar líneas vacías
        if (trimmedLine === "") {
            return;
        }

        // Detectar comentarios de línea
        if (/^\/\//.test(trimmedLine)) {
            tokens.push({ type: "comentarioLinea", value: trimmedLine, line: lineNumber + 1 });
            return; // No procesar más esta línea
        }

        // Separar palabras y delimitadores
        const words = trimmedLine
            .replace(/([{}();])/g, " $1 ") // Separar delimitadores
            .trim()
            .match(/"[^"]*"|\S+/g); // Mantener cadenas completas y separar las demás palabras

        // Validar tokens
        words.forEach((word) => {
            const tokenType = tokenDefinitions.find((def) => def.regex.test(word))?.type;
            if (tokenType) {
                tokens.push({ type: tokenType, value: word, line: lineNumber + 1 });
            } else {
                errors.push(`Token no reconocido en la línea ${lineNumber + 1}: "${word}"`);
            }
        });
    });

    return { tokens, errors };
}


// Parser
function parse(tokens) {
    let currentIndex = 0;

    function expect(expectedType) {
        if (currentIndex < tokens.length && tokens[currentIndex].type === expectedType) {
            return tokens[currentIndex++];
        }
        throw new Error(
            `Error sintáctico: Se esperaba un token de tipo ${expectedType} en la línea ${tokens[currentIndex]?.line || "desconocida"}`
        );
    }

    function INSTRUCCION_COMENTARIO() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            currentIndex++;
        } else {
            throw new Error(
                `Error sintáctico: Comentario no válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }

    function INSTRUCCION_CONSOLE() {
        expect("consoleCommand"); // console.writeline
        expect("delimitador"); // (
        if (tokens[currentIndex]?.type === "literalCadena") {
            expect("literalCadena");
        } else if (tokens[currentIndex]?.type === "identificador") {
            expect("identificador");
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba una cadena o un identificador en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
        expect("delimitador"); // )
        expect("delimitador"); // ;
    }

    function INSTRUCCION_IF() {
        expect("palabraReservada"); // if
        expect("delimitador"); // (
        COMPARACION();
        expect("delimitador"); // )
        BLOQUE_CODIGO();
    }

    function COMPARACION() {
        ELEMENTO();
        expect("operador"); // ==, <, etc.
        ELEMENTO();
    }

    function ELEMENTO() {
        if (
            tokens[currentIndex]?.type === "identificador" ||
            tokens[currentIndex]?.type === "literalNumerica" ||
            tokens[currentIndex]?.type === "literalCadena"
        ) {
            currentIndex++;
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un identificador o literal en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }

    function BLOQUE_CODIGO() {
        expect("delimitador"); // {
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "delimitador"
        ) {
            INSTRUCCION();
        }
        expect("delimitador"); // }
    }

    function INSTRUCCION() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") {
            INSTRUCCION_IF();
        } else if (tokens[currentIndex]?.type === "consoleCommand") {
            INSTRUCCION_CONSOLE();
        } else {
            throw new Error(
                `Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }

    while (currentIndex < tokens.length) {
        INSTRUCCION();
    }
}


// Analizar código
function analyzeCode() {
    const codeInput = document.getElementById("codeInput").value;
    const output = document.getElementById("output");
    output.innerHTML = "";

    const { tokens, errors } = tokenize(codeInput);

    if (errors.length > 0) {
        output.innerHTML = errors[0]; // Mostrar solo el primer error
        return;
    }

    try {
        parse(tokens);
        output.innerHTML = "El código es válido.";
    } catch (e) {
        output.innerHTML = e.message; // Mostrar error sintáctico
    }
}
