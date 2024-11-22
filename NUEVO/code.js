// Definiciones de tokens
const tokenDefinitions = [
    // Operadores especificos primero para evitar conflictos
    { type: "incremento", regex: /^\+\+/ },
    { type: "decremento", regex: /^--/ },
    { type: "operadorAritmetico", regex: /^[+\-*/%]$/ }, // +, -, *, /, %
    { type: "operadorRelacional", regex: /^(<|>|<=|>=|==|!=)$/ }, // <, >, <=, >=, ==, !=
    { type: "asignacion", regex: /^\=$/ },

    // palabras reservadas
    { type: "palabraReservada", regex: /^(if|else|while|do|for|switch|case|default|break|return|checked|unchecked|try|catch|int|double|string|bool|using|system)$/ },
    { type: "excepciones", regex: /^(Exception|IndexOutOfRangeException|NullReferenceException|FormatException)$/ },
    { type: "consoleCommand", regex: /^console\.writeline$/i },
    { type: "consoleReadKey", regex: /^console\.readkey$/i },
    { type: "consoleReadLine", regex: /^console\.readline$/i },
    { type: "mathMax", regex: /^Math\.Max$/i },
    { type: "mathMin", regex: /^Math\.Min$/i },
    { type: "toLower", regex: /^toLower$/i },
    { type: "toUpper", regex: /^toUpper$/i },
    { type: "tipoArray", regex: /^(int|double|string|bool)\s*\[\]$/ },
    
    // elementos de valores
    { type: "identificador", regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
    { type: "literalNumerica", regex: /^[0-9]+(\.[0-9]+)?$/ },
    { type: "literalCadena", regex: /^"([^"]*)"$/ }, // Aceptar espacios y caracteres especiales dentro de comillas
    { type: "literalBooleana", regex: /^(true|false)$/ }, // Booleanos

    // delimitadores de codigo
    { type: "parentesisApertura", regex: /^\($/ },
    { type: "parentesisCierre", regex: /^\)$/ },
    { type: "llaveApertura", regex: /^\{$/ },
    { type: "llaveCierre", regex: /^\}$/ },
    { type: "corcheteApertura", regex: /^\[$/ },
    { type: "corcheteCierre", regex: /^\]$/ },    
    { type: "delimitador", regex: /^;$/ },
    { type: "bloqueCodigo", regex: /^:$/ },
    { type: "separador", regex: /^,$/ },
    { type: "conector", regex: /^.$/ },

    //comentarios
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
            .replace(/([{}();,])/g, " $1 ") // Separar delimitadores
            .replace(/(\+\+|--|[+\-*/%=><!]=?)/g, " $1 ") // Añadir espacio alrededor de los operadores (incremento, decremento, relacionales, etc.)
            .trim()
            .match(/"[^"]*"|\S+/g); // Mantener cadenas completas y separar las demás palabras

        // Validar tokens
        words.forEach((word) => {
            const tokenType = tokenDefinitions.find((def) => def.regex.test(word))?.type;
            if (tokenType) {
                // Agregar el token a la lista
                tokens.push({ type: tokenType, value: word, line: lineNumber + 1 });
                // Mostrar el tipo y valor del token en la consola
                console.log(`Tipo: ${tokenType}, Valor: "${word}", Línea: ${lineNumber + 1}`);
            } else {
                errors.push(`Token no reconocido en la línea ${lineNumber + 1}: "${word}"`);
            }
        });
    });

    return { tokens, errors };
}







// INSTRUCCIONES

// ---------------------------------------- -Parser- ------------------------------------------------
function parse(tokens) 
{
    let currentIndex = 0;
    function expect(expectedType) {
        if (currentIndex < tokens.length && tokens[currentIndex].type === expectedType) {
            return tokens[currentIndex++];
        }
        throw new Error(`Error sintáctico: Se esperaba un token de tipo ${expectedType} en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
    }

    // ---------------------------------------------------------------------------------------------
    // es la instrucion que permite hacer comentarios simples
    function INSTRUCCION_COMENTARIO() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            currentIndex++;
        } else {
            throw new Error(`Error sintáctico: Comentario no válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }

    //si existen las instrucciones, pero las removi para evitar mucho codigo
    
    // ---------------------------------------------------
    // Declaración de variables
    function DECLARACION_VARIABLE() 
    {
        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["int", "double", "string", "bool"].some((t) =>
                tokens[currentIndex].value.startsWith(t)
            )
        ) {
            const tipoDato = tokens[currentIndex].value; // Guardar el tipo de dato
            currentIndex++; // Avanzar al identificador

            // Verificar que el siguiente token es un identificador válido
            if (tokens[currentIndex]?.type === "identificador") {
                const nombreVariable = tokens[currentIndex].value; // Guardar el nombre de la variable
                currentIndex++; // Avanzar al siguiente token

                // Validar si es inicialización de arreglo
                if (tipoDato.includes("[]")) {
                    // Verificar inicialización con '{'
                    if (tokens[currentIndex]?.type === "asignacion") {
                        currentIndex++; // Avanzar sobre '='
                        expect("llaveApertura"); // {
                        
                        // Validar cada elemento del arreglo
                        do {
                            if (
                                (tipoDato.startsWith("int") && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("double") && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("string") && tokens[currentIndex]?.type === "literalCadena") ||
                                (tipoDato.startsWith("bool") && ["true", "false"].includes(tokens[currentIndex]?.value))
                            ) {
                                currentIndex++; // Avanzar al siguiente elemento
                            } else {
                                throw new Error(
                                    `Error sintáctico: Elemento no válido en el arreglo '${nombreVariable}' de tipo '${tipoDato}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                                );
                            }

                            // Validar separadores entre elementos
                            if (tokens[currentIndex]?.type === "separador") {
                                currentIndex++;
                            } else {
                                break; // No hay más elementos
                            }
                        } while (tokens[currentIndex]?.type !== "llaveCierre");

                        expect("llaveCierre"); // }
                    }
                } else {
                    // Validar inicialización normal (no arreglo)
                    if (tokens[currentIndex]?.type === "asignacion") {
                        currentIndex++; // Avanzar sobre '='

                        // Validar el valor inicial
                        if (
                            (tipoDato === "int" && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "double" && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "string" && tokens[currentIndex]?.type === "literalCadena") ||
                            (tipoDato === "bool" && ["true", "false"].includes(tokens[currentIndex]?.value))
                        ) {
                            currentIndex++; // Avanzar sobre el valor inicial
                        } else {
                            throw new Error(
                                `Error sintáctico: Valor inicial no válido para la variable '${nombreVariable}' de tipo '${tipoDato}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                            );
                        }
                    }
                }

                // Validar el delimitador ';'
                expect("delimitador");
            } else {
                throw new Error(
                    `Error sintáctico: Se esperaba un identificador después del tipo de dato en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                );
            }
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un tipo de dato válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }

    function ASIGNACION_VARIABLE() {
        // Verifica que el primer token sea un identificador
        if (tokens[currentIndex]?.type === "identificador") {
            const variable = tokens[currentIndex].value;
            currentIndex++; // Avanza al siguiente token
    
            // Verifica el operador de asignación '='
            expect("asignacion");
    
            // Valida la expresión
            EXPRESION();
    
            // Verifica el delimitador ';'
            expect("delimitador");
        } else {
            throw new Error(`Error sintáctico: Se esperaba un identificador al inicio de la asignación en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    
    // Función para validar una expresión aritmética
    function EXPRESION() {
        TERM(); // Valida el primer término
    
        // Mientras haya operadores aritméticos (+, -, *, /, %), sigue validando términos
        while (
            tokens[currentIndex]?.type === "operadorAritmetico" ||
            tokens[currentIndex]?.type === "parentesisApertura"
        ) {
            if (tokens[currentIndex]?.type === "operadorAritmetico") {
                currentIndex++; // Avanza al operador
                TERM(); // Valida el siguiente término
            } else if (tokens[currentIndex]?.type === "parentesisApertura") {
                // Valida un bloque de paréntesis recursivo
                currentIndex++; // Avanza al paréntesis de apertura
                EXPRESION();
                expect("parentesisCierre"); // Valida que el paréntesis cierre
            }
        }
    }
    
    // Valida un término en la expresión (literal, identificador o paréntesis)
    function TERM() {
        if (
            tokens[currentIndex]?.type === "literalNumerica" ||
            tokens[currentIndex]?.type === "identificador"
        ) {
            currentIndex++; // Avanza al siguiente token
        } else if (tokens[currentIndex]?.type === "parentesisApertura") {
            // Si es un paréntesis, valida la expresión interna
            currentIndex++; // Avanza al paréntesis de apertura
            EXPRESION();
            expect("parentesisCierre"); // Valida que el paréntesis cierre
        } else {
            throw new Error(`Error sintáctico: Término no válido en la expresión en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }

    // ------------------------------------

    function ASIGNACION_METODO() {
        // Verifica que el primer token sea un identificador (nombre de la variable destino)
        if (tokens[currentIndex]?.type === "identificador") {
            const variableDestino = tokens[currentIndex].value; // Guarda el nombre de la variable destino
            currentIndex++; // Avanza al siguiente token
            expect("asignacion");// Verifica el operador de asignación '='
    
            // Identificar el tipo de método o expresión en la asignación
            if (tokens[currentIndex]?.type === "consoleReadLine") {  // Caso: console.readline()
                currentIndex++; // Avanza al token de "Console.ReadLine"
                expect("parentesisApertura");
                expect("parentesisCierre");

            } else if (tokens[currentIndex]?.type === "mathMax" || tokens[currentIndex]?.type === "mathMin") { // Caso: Math.Max(a, b) o Math.Min(a, b)
                currentIndex++; // Avanza al token del método (Math.Max o Math.Min)
                expect("parentesisApertura");
                EXPRESION(); // Primer argumento
                expect("separador"); // Separador ','
                EXPRESION(); // Segundo argumento
                expect("parentesisCierre"); // Paréntesis de cierre

            } else if (tokens[currentIndex]?.type === "identificador" && tokens[currentIndex + 1]?.type === "conector" && (tokens[currentIndex + 2]?.type === "toUpper" || tokens[currentIndex + 2]?.type === "toLower")) { 
                // Caso: txt.ToUpper() o txt.ToLower()
                currentIndex++; // Avanza al identificador (txt)
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza al tipo de método (ToUpper o ToLower)
                expect("parentesisApertura"); // Verifica el paréntesis de apertura
                EXPRESION(); // Primer argumento
                expect("parentesisCierre"); // Paréntesis de cierre
    
            } else {
                throw new Error(`Error sintáctico: Método o expresión no válido para la asignación en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
    
            // Verifica el delimitador ';'
            expect("delimitador");
        } else {
            throw new Error(`Error sintáctico: Se esperaba un identificador al inicio de la asignación en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    
    
    
    
    

// -------------------------------------------------------------------------------------------------------------
// METODOS COMPARTIDOS
    function COMPARACION() {
        ELEMENTO();
        expect("operadorRelacional"); // ==, <, etc.
        ELEMENTO();
    }
    function ELEMENTO() {
        if (
            tokens[currentIndex]?.type === "identificador" ||
            tokens[currentIndex]?.type === "literalNumerica"
        ) {
            currentIndex++;
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un identificador o literal en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }
    function ELEMENTO_INC_DEC() {
        if (
            tokens[currentIndex]?.type === "incremento" ||
            tokens[currentIndex]?.type === "decremento"
        ) {
            currentIndex++;
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un identificador o literal en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }
    function ELEMENTO_EXPANDIDO() {
        if (
            tokens[currentIndex]?.type === "literalNumerica" ||
            tokens[currentIndex]?.type === "literalCadena" ||
            tokens[currentIndex]?.type === "identificador"
        ) {
            currentIndex++;
        } else {
            throw new Error(`Error sintáctico: Se esperaba un valor válido en el 'case' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    
    // ------------------------------------------------------------------------------------------------------------------------------
    // es el que permite bloques de codigo
    function BLOQUE_CODIGO() {
        expect("llaveApertura"); // {
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            INSTRUCCION();
        }
        expect("llaveCierre"); // }
    }

    // ------------------------------------------------------------------------------------------------------------------------------
    function INSTRUCCION() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") {
            if (["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
                DECLARACION_VARIABLE();
            } else if (tokens[currentIndex]?.value === "if") {
                INSTRUCCION_IF();
            } else if (tokens[currentIndex]?.value === "do") {
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "while") {
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "switch") {
                INSTRUCCION_SWITCH();
            } else if (tokens[currentIndex]?.value === "for") {
                INSTRUCCION_FOR();
            } else if (tokens[currentIndex]?.value === "try") {
                INSTRUCCION_TRYCATCH();
            } else if (tokens[currentIndex]?.value === "checked") {
                INSTRUCCION_CHECKED();
            } else if (tokens[currentIndex]?.value === "unchecked") {
                INSTRUCCION_UNCHECKED();
            } else if (tokens[currentIndex]?.value === "using") {
                INSTRUCCION_USING();
            } else {
                throw new Error(`Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
        } else if (
            tokens[currentIndex]?.type === "identificador" &&
            tokens[currentIndex + 1]?.type === "asignacion" &&
            tokens[currentIndex + 2]?.type !== "literalNumerica"
        ) {
            ASIGNACION_METODO();
        } else if (tokens[currentIndex]?.type === "identificador") {
            ASIGNACION_VARIABLE();
        } else if (tokens[currentIndex]?.type === "consoleCommand") {
            INSTRUCCION_IMPRIMIR();
        } else if (tokens[currentIndex]?.type === "consoleReadKey") {
            INSTRUCCION_READKEY();
        } else {
            throw new Error(`Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    
    // ------------------------------
    while (currentIndex < tokens.length) {
        INSTRUCCION();
    }
}

// --------------------------------------------------------------------------------------------
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