const tokenDefinitions = [
    { type: "palabraReservada", regex: /\b(if|else|while|for|console\.writeline)\b/ },
    { type: "identificador", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/ },
    { type: "literalNumerica", regex: /\b\d+(\.\d+)?\b/ },
    { type: "literalCadena", regex: /"(.*?)"/ }, // Maneja cadenas entre comillas dobles
    { type: "comentarioLinea", regex: /\/\/.*/ },
    { type: "comentarioMultilinea", regex: /\/\*[\s\S]*?\*\// },
    { type: "operador", regex: /==|!=|<=|>=|<|>/ },
    { type: "delimitador", regex: /[{}();]/ }
];

function tokenize(input) {
    const tokens = [];
    let lineNumber = 1;

    while (input.length > 0) {
        input = input.trimStart(); // Elimina espacios al inicio
        let matched = false;

        // Si es un salto de línea, lo ignoramos y pasamos a la siguiente
        if (input[0] === '\n') {
            lineNumber++;
            input = input.slice(1);
            continue;
        }

        for (const { type, regex } of tokenDefinitions) {
            const match = regex.exec(input);
            if (match && match.index === 0) {
                tokens.push({ type, value: match[0], lineNumber });
                input = input.slice(match[0].length);
                matched = true;
                break;
            }
        }

        if (!matched) {
            if (/\s/.test(input[0])) {
                // Ignorar cualquier espacio o tabulación sin generar un token
                input = input.slice(1);
            } else {
                throw new Error(`Token no reconocido en la línea ${lineNumber}: "${input}"`);
            }
        }
    }

    return tokens;
}

function analyzeCode() {
    const codeInput = document.getElementById("codeInput").value;
    const outputElement = document.getElementById("output");
    outputElement.textContent = ""; // Limpia la salida anterior

    try {
        const tokens = tokenize(codeInput);
        const isValid = parseTokens(tokens);
        outputElement.textContent = isValid ? "El código fuente es válido." : "El código fuente contiene errores sintácticos.";
    } catch (error) {
        outputElement.textContent = error.message;
    }
}

function parseTokens(tokens) {
    let index = 0;

    function expect(expectedType) {
        const token = tokens[index];
        if (!token || token.type !== expectedType) {
            throw new Error(`Error sintáctico: Se esperaba '${expectedType}' pero se encontró '${token ? token.value : "nada"}'.`);
        }
        index++;
        return token;
    }

    function INSTRUCCION() {
        if (tokens[index].type === "comentarioLinea" || tokens[index].type === "comentarioMultilinea") {
            index++; // Ignoramos los comentarios
        } else if (tokens[index].type === "palabraReservada" && tokens[index].value === "console.writeline") {
            expect("palabraReservada");
            expect("delimitador"); // Paréntesis de apertura '('
            if (tokens[index].type === "literalCadena" || tokens[index].type === "identificador") {
                index++;
            } else {
                throw new Error("Error sintáctico: Se esperaba una cadena literal o un identificador dentro de console.writeline.");
            }
            expect("delimitador"); // Paréntesis de cierre ')'
            expect("delimitador"); // Punto y coma ';'
        } else if (tokens[index].type === "palabraReservada" && tokens[index].value === "if") {
            expect("palabraReservada");
            expect("delimitador"); // Paréntesis de apertura '('
            COMPARACION();
            expect("delimitador"); // Paréntesis de cierre ')'
            BLOQUE_CODIGO();
        } else {
            throw new Error("Error sintáctico: Instrucción no válida.");
        }
    }

    function COMPARACION() {
        if (tokens[index].type === "identificador" || tokens[index].type === "literalNumerica") {
            index++;
        } else {
            throw new Error("Error sintáctico: Se esperaba un identificador o una literal numérica en la comparación.");
        }
        expect("operador");
        if (tokens[index].type === "identificador" || tokens[index].type === "literalNumerica") {
            index++;
        } else {
            throw new Error("Error sintáctico: Se esperaba un identificador o una literal numérica después del operador.");
        }
    }

    function BLOQUE_CODIGO() {
        expect("delimitador"); // Llave de apertura '{'
        while (tokens[index] && tokens[index].type !== "delimitador") {
            INSTRUCCION();
        }
        expect("delimitador"); // Llave de cierre '}'
    }

    while (index < tokens.length) {
        INSTRUCCION();
    }

    return true;
}
