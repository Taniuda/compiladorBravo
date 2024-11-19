// Definiciones de tokens
const tokenDefinitions = [
    { type: "palabraReservada", regex: /^(if|else|while|do|for|switch|case|default|break|return)$/ },
    { type: "consoleCommand", regex: /^console\.writeline$/ },
    { type: "identificador", regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
    { type: "literalNumerica", regex: /^[0-9]+(\.[0-9]+)?$/ },
    { type: "literalCadena", regex: /^"([^"]*)"$/ }, // Aceptar espacios y caracteres especiales dentro de comillas
    { type: "operador", regex: /^(<|>|<=|>=|==|!=)$/ }, //---------CAMBIO DE JAVI
    { type: "asignacion", regex: /^\=$/ },
    { type: "parentesisApertura", regex: /^\($/ },
    { type: "parentesisCierre", regex: /^\)$/ },
    { type: "llaveApertura", regex: /^\{$/ },
    { type: "llaveCierre", regex: /^\}$/ },
    { type: "delimitador", regex: /^;$/ },
    { type: "bloqueCodigo", regex: /^:$/ },
    { type: "incremento", regex: /^\+\+$/ },
    { type: "decremento", regex: /^--$/ },
    { type: "separador", regex: /^,$/ },
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

    // es la instrucion que permite hacer comentarios simples
    function INSTRUCCION_COMENTARIO() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            currentIndex++;
        } else {
            throw new Error(
                `Error sintáctico: Comentario no válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }

    // es la instruccion de imprimir en pantalla (Console.Writeline)
    function INSTRUCCION_CONSOLE() {
        expect("consoleCommand"); // console.writeline
        expect("parentesisApertura"); // (
    
        // Procesar múltiples cadenas o variables separadas por comas
        do {
            EXPRESION(); // Procesar una cadena o identificador
            if (tokens[currentIndex]?.type === "separador" && tokens[currentIndex].value === ",") {
                currentIndex++; // Avanzar sobre la coma
            } else {
                break; // No hay más elementos separados por comas
            }
        } while (currentIndex < tokens.length);
    
        expect("parentesisCierre"); // )
        expect("delimitador"); // ;
    }
    
    // Método para manejar una expresión (cadena o variable)
    function EXPRESION() {
        if (tokens[currentIndex]?.type === "literalCadena") {
            expect("literalCadena");
        } else if (tokens[currentIndex]?.type === "identificador") {
            expect("identificador");
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba una cadena o un identificador en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }
    

    // es la instruccion de condicional
    function INSTRUCCION_IF() {
        expect("palabraReservada"); // if
        expect("parentesisApertura"); // (
        COMPARACION(); // Evaluamos la condición del if
        expect("parentesisCierre"); // )
        BLOQUE_CODIGO(); // Bloque principal del if
    
        // Procesar múltiples bloques "else if"
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.value === "else" &&
            tokens[currentIndex + 1]?.value === "if"
        ) {
            expect("palabraReservada"); // else
            expect("palabraReservada"); // if
            expect("parentesisApertura"); // (
            COMPARACION(); // Evaluamos la condición del else if
            expect("parentesisCierre"); // )
            BLOQUE_CODIGO(); // Bloque del else if
        }
    
        // Procesar bloque "else" (opcional)
        if (currentIndex < tokens.length && tokens[currentIndex]?.value === "else") {
            expect("palabraReservada"); // else
            BLOQUE_CODIGO(); // Bloque del else
        }
    }

    function INSTRUCCION_WHILE() {
        if (tokens[currentIndex]?.value === "do") {
            // Caso de "do while"
            expect("palabraReservada"); // do
            BLOQUE_CODIGO(); // Bloque de código que se ejecuta al menos una vez
            expect("palabraReservada"); // while
            expect("parentesisApertura"); // (
            COMPARACION(); // Evaluar la condición del do while
            expect("parentesisCierre"); // )
            expect("delimitador"); // ;
        } else {
            // Caso de "while"
            expect("palabraReservada"); // while
            expect("parentesisApertura"); // (
            COMPARACION(); // Evaluar la condición del while
            expect("parentesisCierre"); // )
            BLOQUE_CODIGO(); // Bloque de código a ejecutar mientras la condición sea verdadera
        }
    }

    function INSTRUCCION_FOR() {
        expect("palabraReservada"); // for
        expect("parentesisApertura"); // (
        
        // Inicialización (puede ser una declaración o asignación)
        if (tokens[currentIndex]?.type === "identificador") {
            ELEMENTO(); // Identificador o inicializador
            expect("asignacion"); // =
            ELEMENTO(); // Literal numérica o identificador
        } else {
            throw new Error(
                `Error sintáctico: Inicialización no válida en el 'for' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
        expect("delimitador"); // ;
        
        // Condición
        COMPARACION(); // Validar condición (e.g., i < 10)
        expect("delimitador"); // ;
        
        // Incremento/Decremento
        if (
            tokens[currentIndex]?.type === "identificador" &&
            (tokens[currentIndex + 1]?.type === "incremento" || tokens[currentIndex + 1]?.type === "decremento")
        ) {
            ELEMENTO(); // Identificador
            ELEMENTO_INC_DEC(); // ++ o --
        } else if (tokens[currentIndex]?.type === "identificador") {
            ELEMENTO(); // Identificador
            expect("operador"); // +=, -=
            ELEMENTO(); // Literal o identificador
        } else {
            throw new Error(
                `Error sintáctico: Incremento/Decremento no válido en el 'for' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
        
        expect("parentesisCierre"); // )
        
        // Bloque de código
        BLOQUE_CODIGO();
    }
    
    
    
    
    function INSTRUCCION_SWITCH() {
        expect("palabraReservada"); // switch
        expect("parentesisApertura"); // (
        ELEMENTO(); // Expresión en el switch (puede ser un identificador, número, etc.)
        expect("parentesisCierre"); // )
        expect("llaveApertura"); // {
    
        // Procesamos los casos
        while (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "case") {
            INSTRUCCION_CASE();
        }
    
        // Procesamos el default, si existe
        if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "default") {
            INSTRUCCION_DEFAULT();
        }
    
        expect("llaveCierre"); // }
    }

    function INSTRUCCION_CASE() {
        expect("palabraReservada"); // case
        ELEMENTO(); // La expresión del case (puede ser un número, cadena, identificador, etc.)
        expect("bloqueCodigo"); // :
        BLOQUE_CODIGO(); // Bloque de código a ejecutar mientras la condición sea verdadera
        
        // Procesar las instrucciones dentro del case
        while (tokens[currentIndex]?.type !== "palabraReservada" || tokens[currentIndex]?.value === "case" || tokens[currentIndex]?.value === "default") {
            INSTRUCCION();
    
            // Si encontramos un break, lo procesamos y salimos del case
            if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "break") {
                expect("palabraReservada"); // break
                expect("delimitador"); // ;
                break;
            }
        }
    }
    
    function INSTRUCCION_DEFAULT() {
        expect("palabraReservada"); // default
        expect("delimitador"); // :
        
        // Procesar las instrucciones dentro del default
        while (tokens[currentIndex]?.type !== "delimitador" && tokens[currentIndex]?.value !== "}") {
            INSTRUCCION();
        }
    }
    
    














    












    

    // metodo multiusos de comparacion
    function COMPARACION() {
        ELEMENTO();
        expect("operador"); // ==, <, etc.
        ELEMENTO();
    }

    // metodo multiusos
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

    // metodo multiusos
    /*
    function ELEMENTO_EXPANDIDO() {
        if (tokens[currentIndex]?.type === "identificador" ||
            tokens[currentIndex]?.type === "literalNumerica" || 
            tokens[currentIndex]?.type === "literalCadena"
        ) {
            // Validar que el elemento sea una expresión válida (número, cadena, etc.)
            currentIndex++;
        } else {
            throw new Error(`Error sintáctico: Se esperaba una expresión válida después de 'case' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    */

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

    function INSTRUCCION() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") {
            if (tokens[currentIndex]?.value === "if") {
                INSTRUCCION_IF();
            } else if (tokens[currentIndex]?.value === "while") {
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "switch") {
                INSTRUCCION_SWITCH();
            } else if (tokens[currentIndex]?.value === "for") {
                INSTRUCCION_FOR();
            } else {
                throw new Error(
                    `Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                );
            }
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





