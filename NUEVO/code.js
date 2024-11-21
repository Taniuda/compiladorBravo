// Definiciones de tokens
const tokenDefinitions = [
    // Operadores especificos primero para evitar conflictos
    { type: "incremento", regex: /^\+\+/ },
    { type: "decremento", regex: /^--/ },
    { type: "operadorAritmetico", regex: /^[+\-*/%]$/ }, // +, -, *, /, %
    { type: "operadorRelacional", regex: /^(<|>|<=|>=|==|!=)$/ }, // <, >, <=, >=, ==, !=
    { type: "asignacion", regex: /^\=$/ },

    // palabras reservadas
    { type: "palabraReservada", regex: /^(if|else|while|do|for|switch|case|default|break|return|checked|unchecked|try|catch|int|double|string|bool)$/ },
    { type: "excepciones", regex: /^(Exception|IndexOutOfRangeException|NullReferenceException|FormatException)$/ },
    { type: "consoleCommand", regex: /^console\.writeline$/ },
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
                tokens.push({ type: tokenType, value: word, line: lineNumber + 1 });
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

    // --------------------------------------------------------------------------------------------
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
            throw new Error(`Error sintáctico: Se esperaba una cadena o un identificador en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }
    
    // ----------------------------------------------------------------------------------------
    // es la instruccion de condicional, si, sino, contrario
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

    // ---------------------------------------------------------------------------------------------------
    // instruccion While
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

    // ----------------------------------------------------------------------------------------------------
    // instruccion for
    function INSTRUCCION_FOR() {
        expect("palabraReservada"); // for
        expect("parentesisApertura"); // (
        
        // Inicialización (puede ser una declaración o asignación)
        if (tokens[currentIndex]?.type === "palabraReservada" && ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
            // Caso con tipo de dato explícito
            expect("palabraReservada"); // tipo de dato (int, double, etc.)
            expect("identificador"); // identificador
            expect("asignacion"); // =
            ELEMENTO(); // Literal numérica o identificador
        } else if (tokens[currentIndex]?.type === "identificador") {
            // Caso sin tipo de dato (solo asignación)
            ELEMENTO(); // Identificador
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


    
    // -------------------------------------------------------------------------------------------------------------
    // instruccion switch
    function INSTRUCCION_SWITCH() {
        expect("palabraReservada"); // switch
        expect("parentesisApertura"); // (
        ELEMENTO(); // Expresión del switch
        expect("parentesisCierre"); // )
        expect("llaveApertura"); // {
        
        // Procesar casos
        while (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "case") {
            INSTRUCCION_CASE();
        }
    
        // Procesar default si existe
        if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "default") {
            INSTRUCCION_DEFAULT();
        }
    
        expect("llaveCierre"); // }
    }
    
    function INSTRUCCION_CASE() {
        expect("palabraReservada"); // case
        ELEMENTO_EXPANDIDO(); // Valor del case (puede ser un número, cadena, etc.)
        expect("bloqueCodigo"); // :
        
        // Procesar instrucciones dentro del case
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "palabraReservada" &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            INSTRUCCION();
    
            // Procesar break si existe
            if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "break") {
                expect("palabraReservada"); // break
                expect("delimitador"); // ;
                break;
            }
        }
    }
    
    function INSTRUCCION_DEFAULT() {
        expect("palabraReservada"); // default
        expect("bloqueCodigo"); // :
        
        // Procesar instrucciones dentro del default
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            INSTRUCCION();
        }
    }
    
    
    // ------------------------------------------------------------------------------------------------------
    // instruccion Checked y unchecked
    function INSTRUCCION_CHECKED() {
        expect("palabraReservada"); // checked
        BLOQUE_CODIGO(); // Bloque de código protegido contra desbordamientos
    }

    function INSTRUCCION_UNCHECKED() {
        expect("palabraReservada"); // unchecked
        BLOQUE_CODIGO(); // Bloque de código que permite desbordamientos
    }

    // ------------------------------------------------------------------------------------------------------
    // Declaración de variables
    function DECLARACION_VARIABLE() {
    // Detectar el tipo de dato (int, double, string, bool) o arreglo
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



    //-----------------------------------------------------------------------
    
 


    // ------------------------------------------------------------------------------------------------------
    // Instrucción Try-Catch
    function INSTRUCCION_TRYCATCH() {
        expect("palabraReservada"); // try
        BLOQUE_CODIGO(); // Bloque asociado al try

        // Procesar uno o más bloques "catch"
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type === "palabraReservada" &&
            tokens[currentIndex]?.value === "catch"
        ) {
            expect("palabraReservada"); // catch
            expect("parentesisApertura"); // (
            if (
                tokens[currentIndex]?.type === "excepciones" &&
                ["Exception", "IndexOutOfRangeException", "NullReferenceException", "FormatException"].includes(tokens[currentIndex]?.value)
            ) {
                expect("excepciones"); // Tipo de excepción
                expect("identificador"); // Nombre de la variable de excepción (opcional)
            } else {
                throw new Error(
                    `Error sintáctico: Se esperaba un tipo de excepción válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                );
            }
            expect("parentesisCierre"); // )
            BLOQUE_CODIGO(); // Bloque asociado al catch
        }

        /*
        // Bloque opcional "finally"
        if (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type === "palabraReservada" &&
            tokens[currentIndex]?.value === "finally"
        ) {
            expect("palabraReservada"); // finally
            BLOQUE_CODIGO(); // Bloque asociado al finally
        }
        */
    }

// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// METODOS COMPARTIDOS
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


    // metodo multiusos de comparacion
    function COMPARACION() {
        ELEMENTO();
        expect("operadorRelacional"); // ==, <, etc.
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
    // ------------------------------------------------------------------------------------------------------------------------------
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
    // aqui deben ir todas las instrucciones:

    function INSTRUCCION() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") {

            if (tokens[currentIndex]?.type === "palabraReservada" &&
                ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)
            ) {
                DECLARACION_VARIABLE();
            } else if (tokens[currentIndex]?.type === "identificador"){
                ASIGNACION_VARIABLE();
            } 
            
            
            //cuando tienen palabras reservadas:
            else if (tokens[currentIndex]?.value === "if") {
                INSTRUCCION_IF();
            } else if (tokens[currentIndex]?.value === "while") {
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "do") {
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "switch") {
                INSTRUCCION_SWITCH();
            } else if (tokens[currentIndex]?.value === "for") {
                INSTRUCCION_FOR();
            } else if (tokens[currentIndex]?.value === "checked") {
                INSTRUCCION_CHECKED();
            } else if (tokens[currentIndex]?.value === "unchecked") {
                INSTRUCCION_UNCHECKED();
            } else if (tokens[currentIndex]?.value === "try") {
                INSTRUCCION_TRYCATCH();
            } else {
                throw new Error(`Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
        } 

        else if (tokens[currentIndex]?.type === "consoleCommand") {
            INSTRUCCION_CONSOLE();
        } else if (tokens[currentIndex]?.type === "comentarioLinea") {
            INSTRUCCION_COMENTARIO();
        } else {
            throw new Error(
                `Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
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