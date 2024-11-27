// Definiciones de tokens
const tokenDefinitions = [
    // Operadores especificos primero para evitar conflictos
    { type: "incremento", regex: /^\+\+/ },
    { type: "decremento", regex: /^--/ },
    { type: "operadorAritmetico", regex: /^[+\-*/%]$/ }, // +, -, *, /, %
    { type: "operadorRelacional", regex: /^(<|>|<=|>=|==|!=)$/ }, // <, >, <=, >=, ==, !=
    { type: "operadorBoleano", regex: /^(\&\&|\|\|)$/ },
    { type: "asignacion", regex: /^\=$/ },
    { type: "operadorNegacion", regex: /^\!$/ },
    { type: "intParse", regex: /^int\.parse$/i },
    { type: "DoubleParse", regex: /^double\.parse$/i },

    // palabras reservadas
    { type: "palabraReservada", regex: /^(if|else|while|do|for|switch|case|default|break|checked|unchecked|try|catch|void|int|double|string|bool|using|system|array|length|Main|args|class|in)$/ },
    { type: "excepciones", regex: /^(Exception|IndexOutOfRangeException|NullReferenceException|FormatException)$/ },
    { type: "modificadoresAcceso", regex: /^(public|private|protected|internal)$/ },
    { type: "static", regex: /^static$/i },
    { type: "tipoDatoMetodo", regex: /^(void|int|string|bool|double)$/ },
    { type: "toUpper", regex: /^toUpper$/i },
    { type: "toLower", regex: /^toLower$/i },
    { type: "console", regex: /^console$/i },
    { type: "writeline", regex: /^writeline$/i },
    { type: "readline", regex: /^readline$/i },
    { type: "readkey", regex: /^readkey$/i },
    { type: "math", regex: /^math$/i },
    { type: "max", regex: /^max$/i },
    { type: "min", regex: /^min$/i },
    { type: "copy", regex: /^copy$/i },
    { type: "return", regex: /^return$/i },
    
    // elementos de valores
    { type: "identificador", regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
    { type: "literalNumerica", regex: /^[0-9]+(\.[0-9]+)?(f|F)?$/ }, // Detectar números decimales correctamente
    { type: "conector", regex: /^\.$/ }, // Punto como separador general

    { type: "literalCadena", regex: /^"([^"]*)"$/ }, // Aceptar espacios y caracteres especiales dentro de comillas
    { type: "literalBooleana", regex: /^(true|false)$/ }, // Booleanos

    // delimitadores de codigo
    { type: "parentesisApertura", regex: /^\($/ },
    { type: "parentesisCierre", regex: /^\)$/ },
    { type: "llaveApertura", regex: /^\{$/ },
    { type: "llaveCierre", regex: /^\}$/ },
    { type: "arrayBrackets", regex: /^\[\]$/ }, // Captura [] como un único token
    { type: "corcheteApertura", regex: /^\[$/ },
    { type: "corcheteCierre", regex: /^\]$/ },  
    { type: "delimitador", regex: /^;$/ },
    { type: "bloqueCodigo", regex: /^:$/ },
    { type: "separador", regex: /^,$/ },
    { type: "conector", regex: /^.$/ },

    //comentarios
    { type: "comentarioLinea", regex: /^\/\/.*$/ },
];

// Actualizar el proceso de tokenización
function tokenize(code) {
    const lines = code.split("\n");
    const tokens = [];
    const errors = [];

    lines.forEach((line, lineNumber) => {
        const trimmedLine = line.trim();

        if (trimmedLine === "") return; // Ignorar líneas vacías

        if (/^\/\//.test(trimmedLine)) { // Detectar comentarios
            tokens.push({ type: "comentarioLinea", value: trimmedLine, line: lineNumber + 1 });
            return;
        }

        // Separar palabras y delimitadores
        const words = trimmedLine
            .replace(/([{}();,])/g, " $1 ") // Separar delimitadores comunes
            .replace(/(\[\])/g, " $1 ") // Separar [] como unidad
            .replace(/(\+\+|--|[+\-*/%=><!]=?)/g, " $1 ") // Separar operadores
            //.replace(/(\()|(\))/g, " $1$2 ")
            .replace(/([a-zA-Z_]+\.[a-zA-Z_]+)/g, (match) => match.split(".").join(" . "))
            .trim()
            .match(/"[^"]*"|\S+/g); // Mantener cadenas y dividir palabras

        // Validar tokens
        words.forEach((word) => {
            const tokenType = tokenDefinitions.find((def) => def.regex.test(word))?.type;
            if (tokenType) {
                tokens.push({ type: tokenType, value: word, line: lineNumber + 1 });
                console.log(`${tokenType},"${word}", Línea: ${lineNumber + 1}`);
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
    function INSTRUCCION_IMPRIMIR() {
        // Verificar que sea "console"
        if (tokens[currentIndex]?.value.toLowerCase() === "console") {
            currentIndex++; // Avanzar a "console"
            expect("conector"); // Verificar el conector "."
            
            // Verificar que sea "writeline"
            if (tokens[currentIndex]?.value.toLowerCase() === "writeline") {
                currentIndex++; // Avanzar a "writeline"
            } else {
                throw new Error(`Error sintáctico: Se esperaba 'WriteLine' después de 'console.' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
            
            expect("parentesisApertura"); // Verificar el paréntesis de apertura "("
            concatenacion();
            
            expect("parentesisCierre"); // Verificar el paréntesis de cierre ")"
            expect("delimitador"); // Verificar el punto y coma ";"
        } else {
            throw new Error(`Error sintáctico: Se esperaba 'console' al inicio de la instrucción en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
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
    function INSTRUCCION_FOREACH() {
        expect("palabraReservada"); // foreach
        expect("parentesisApertura"); // (
    
        // Procesar el contenido dentro de los paréntesis
        procesarParentesisForeach();
    
        expect("parentesisCierre"); // )
    
        // Bloque de código
        BLOQUE_CODIGO();
    }
    
    // Función auxiliar para manejar el contenido de los paréntesis en el foreach
    function procesarParentesisForeach() {
        // Declaración del identificador
        if (tokens[currentIndex]?.type === "palabraReservada" && ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
            // Caso con tipo de dato explícito (como en un for tradicional)
            expect("palabraReservada"); // tipo de dato (int, double, etc.)
            expect("identificador"); // identificador (por ejemplo, "elemento")
        } else if (tokens[currentIndex]?.type === "identificador") {
            // Si no hay tipo de dato explícito, asumimos que es una variable simple (por ejemplo, `elemento` en `foreach elemento in arreglo`)
            expect("identificador"); // identificador (por ejemplo, "elemento")
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un tipo de dato o un identificador en la declaración del foreach en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    
        expect("palabraReservada", "in"); // in
        expect("identificador"); // Aquí debería estar la colección o iterable sobre la cual iterar (ejemplo: arreglo)
    }
    
    // Función para esperar y verificar el tipo y valor de un token
    function expect(tipo, valor) {
        if (tokens[currentIndex]?.type !== tipo || (valor && tokens[currentIndex]?.value !== valor)) {
            throw new Error(`Error sintáctico: Se esperaba un token de tipo ${tipo}${valor ? ` con valor "${valor}"` : ''}, pero se encontró ${tokens[currentIndex]?.type} en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
        currentIndex++; // Avanzamos al siguiente token
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

    // ---------------------------------------------

    function INSTRUCCION_READKEY() {
        expect("console"); // console.readkey;
        expect("conector"); // console.readkey;
        expect("readkey"); // console.readkey;
        expect("parentesisApertura"); // (
        expect("parentesisCierre"); // )
        expect("delimitador"); // ;
    }

    function INSTRUCCION_USING() {
        expect("palabraReservada"); // using;
        expect("palabraReservada"); // system;
        expect("delimitador"); // ;
    }

    function INSTRUCCION_ARRAY_COPY() {
        expect("palabraReservada"); // Verifica "Array"
        expect("conector"); // Verifica "."
        expect("copy"); // Verifica "Copy"
    
        expect("parentesisApertura"); // "("
        expect("identificador"); // sourceArray
        expect("separador"); // ","
        expect("identificador"); // destinationArray
        expect("separador"); // ","
        expect("literalNumerica"); // length
        expect("parentesisCierre"); // ")"
        expect("delimitador"); // ";"
    }
    
    

    
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
    // ------------------------------------

    function DECLARACION_ARREGLOS() {
        // Verifica que comience con un tipo de dato válido
        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)
        ) {
            const tipoDato = tokens[currentIndex].value; // Guarda el tipo de dato
            currentIndex++; // Avanza al siguiente token
    
            // Verifica el token `arrayBrackets` para los corchetes `[]`
            expect("arrayBrackets");
    
            // Verifica que el siguiente token sea un identificador
            expect("identificador");
    
            // Verifica el operador de asignación `=`
            expect("asignacion");
    
            // Verifica la llave de apertura `{`
            expect("llaveApertura");
    
            // Valida los elementos dentro del arreglo
            do {
                if (
                    (tipoDato === "int" && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                    (tipoDato === "double" && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                    (tipoDato === "string" && tokens[currentIndex]?.type === "literalCadena") ||
                    (tipoDato === "bool" && ["true", "false"].includes(tokens[currentIndex]?.value))
                ) {
                    currentIndex++;
                } else {
                    throw new Error(
                        `Error sintáctico: Elemento no válido en el arreglo de tipo '${tipoDato}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                    );
                }
    
                if (tokens[currentIndex]?.type === "separador") {
                    currentIndex++;
                } else {
                    break;
                }
            } while (tokens[currentIndex]?.type !== "llaveCierre");
    
            // Verifica la llave de cierre `}`
            expect("llaveCierre");
    
            // Verifica el delimitador `;`
            expect("delimitador");
        } else {
            throw new Error(
                `Error sintáctico: Declaración de arreglo no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    }
    
    
    

    
    // ------------------------------------

    function ASIGNACION_METODO() {
        // Verifica que el primer token sea un identificador (nombre de la variable destino)
        if (tokens[currentIndex]?.type === "identificador") {
            const variableDestino = tokens[currentIndex].value; // Guarda el nombre de la variable destino
            currentIndex++; // Avanza al siguiente token
            expect("asignacion");// Verifica el operador de asignación '='
    
            // Caso: console.ReadLine()
            if (tokens[currentIndex]?.value.toLowerCase() === "console" && 
            tokens[currentIndex + 1]?.type === "conector" && 
            tokens[currentIndex + 2]?.value.toLowerCase() === "readline") 
            {
                currentIndex++; // Avanza a "console"
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "ReadLine"
                expect("parentesisApertura"); // Verifica el paréntesis de apertura
                expect("parentesisCierre"); // Verifica el paréntesis de cierre

            // Caso: Math.Max(a, b) o Math.Min(a, b)
            } else if (tokens[currentIndex]?.type === "math" && 
                    tokens[currentIndex + 1]?.type === "conector" && 
                    (tokens[currentIndex + 2]?.type === "max" || tokens[currentIndex + 2]?.type === "min") ) 
            {
                currentIndex++; // Avanza a "Math"
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "Max" o "Min"
                expect("parentesisApertura"); // Verifica el paréntesis de apertura
                EXPRESION(); // Valida el primer argumento
                expect("separador"); // Verifica la coma ','
                EXPRESION(); // Valida el segundo argumento
                expect("parentesisCierre"); // Verifica el paréntesis de cierre

            } else if (tokens[currentIndex]?.type === "identificador" && 
                tokens[currentIndex + 1]?.type === "conector" && 
                (tokens[currentIndex + 2]?.type === "toUpper" || tokens[currentIndex + 2]?.type === "toLower")) 
            {
                currentIndex++; // Avanza al identificador (txt)
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza al tipo de método (ToUpper o ToLower)
                expect("parentesisApertura"); // Verifica el paréntesis de apertura
                expect("parentesisCierre"); // Verifica el paréntesis de cierre
            } else if (tokens[currentIndex]?.type === "identificador" && 
                    tokens[currentIndex + 1]?.type === "conector" && 
                    tokens[currentIndex + 2]?.value === "length") 
            {
                currentIndex++; // Avanza al identificador (array)
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "length"
                // No hay paréntesis, así que no se requiere más validación
            } else {
                throw new Error(`Error sintáctico: Método o expresión no válido para la asignación en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
    
            // Verifica el delimitador ';'
            expect("delimitador");
        } else {
            throw new Error(`Error sintáctico: Se esperaba un identificador al inicio de la asignación en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
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

    function EXPRESION() {
        // Procesa paréntesis al inicio de la expresión si están presentes
        if (tokens[currentIndex]?.type === "parentesisApertura") {
            currentIndex++; // Avanza al paréntesis de apertura
            EXPRESION(); // Llama recursivamente a EXPRESION
            expect("parentesisCierre"); // Verifica que el paréntesis se cierra
        } else {
            // Procesamos el primer término
            TERM();
        }

        // Mientras haya operadores aritméticos (+, -, *, /, %) o más paréntesis, sigue validando términos
        while (
            tokens[currentIndex]?.type === "operadorAritmetico" ||
            tokens[currentIndex]?.type === "parentesisApertura"
        ) {
            if (tokens[currentIndex]?.type === "operadorAritmetico") {
                currentIndex++; // Avanza al operador
                TERM(); // Valida el siguiente término
            } else if (tokens[currentIndex]?.type === "parentesisApertura") {
                currentIndex++; // Avanza al paréntesis de apertura
                EXPRESION(); // Llama recursivamente para procesar la expresión dentro del paréntesis
                expect("parentesisCierre"); // Asegúrate de que se cierre el paréntesis
            }
        }
    }

    function TERM() {
        if (
            tokens[currentIndex]?.type === "literalNumerica" || // Número
            tokens[currentIndex]?.type === "identificador" ||  // Variable
            tokens[currentIndex]?.type === "literalCadena"     // Cadena
        ) {
            currentIndex++; // Avanza al siguiente token
        } else if (tokens[currentIndex]?.type === "parentesisApertura") {
            // Procesa expresiones entre paréntesis
            currentIndex++; // Avanza al paréntesis de apertura
            EXPRESION(); // Llama a EXPRESION para procesar el contenido
            expect("parentesisCierre"); // Asegúrate de que se cierre el paréntesis
        } else {
            throw new Error(`Error sintáctico: Término no válido en la expresión en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }

// -----------------------------------------------

    function DECLARACION_METODO_VIEJITO() {
        console.log("hola");
        // Verifica que el primer token sea un modificador de acceso
        expect("modificadoresAcceso"); // public, private, etc.

        // Verifica si el siguiente token es 'static' (opcional)
        if (tokens[currentIndex]?.type === "static") {
            currentIndex++;
        }

        // Verifica el tipo de retorno (obligatorio)
        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["void", "int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)
        ) {
            currentIndex++; // Avanza al siguiente token
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un tipo de retorno válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }

        // Verifica el identificador (nombre del método)
        expect("identificador");

        // Verifica el paréntesis de apertura
        expect("parentesisApertura");

        // Verifica si hay argumentos en el método
        if (tokens[currentIndex]?.type === "palabraReservada" &&
            ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
            do {
                expect("palabraReservada"); // Tipo del argumento
                expect("identificador");   // Nombre del argumento
                if (tokens[currentIndex]?.type === "separador") {
                    currentIndex++; // Avanza la coma
                } else {
                    break; // No hay más argumentos
                }
            } while (true);
        }

        // Verifica el paréntesis de cierre
        expect("parentesisCierre");

        // Verifica el bloque de código
        BLOQUE_CODIGO();
    }




    






    function DECLARACION_METODO() {
        // Verifica que el primer token sea un modificador de acceso
        expect("modificadoresAcceso"); // public, private, etc.
    
        // Verifica si el siguiente token es 'static' (opcional)
        if (tokens[currentIndex]?.type === "static") {
            currentIndex++;
        }
    
        // Verifica el tipo de retorno
        const returnType = tokens[currentIndex]?.value; // Guarda el tipo de retorno
        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["void", "int", "double", "string", "bool"].includes(returnType)
        ) {
            currentIndex++; // Avanza al siguiente token
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba un tipo de retorno válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
    
        // Verifica el identificador (nombre del método)
        expect("identificador");
    
        // Verifica el paréntesis de apertura
        expect("parentesisApertura");
    
        // Verifica si hay argumentos en el método
        if (tokens[currentIndex]?.type === "palabraReservada" &&
            ["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
            do {
                expect("palabraReservada"); // Tipo del argumento
                expect("identificador");   // Nombre del argumento
                if (tokens[currentIndex]?.type === "separador") {
                    currentIndex++; // Avanza la coma
                } else {
                    break; // No hay más argumentos
                }
            } while (true);
        }
    
        // Verifica el paréntesis de cierre
        expect("parentesisCierre");
    
        // Verifica el bloque de código
        BLOQUE_CODIGO_RETORNABLE(returnType !== "void");
    }
    
    function BLOQUE_CODIGO_RETORNABLE(needsReturn) {
        expect("llaveApertura"); // {
        let hasReturn = false;
    
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            if (tokens[currentIndex]?.type === "return") {
                hasReturn = true; // Marca que se encontró un return
                currentIndex++; // Avanza sobre el token "return"
                if (needsReturn) {
                    expect("identificador"); // Asegura que devuelve algo
                }
                expect("delimitador"); // ;
            } else {
                INSTRUCCION();
            }
        }
    
        if (needsReturn && !hasReturn) {
            throw new Error(`Error sintáctico: El método debe tener un return válido.`);
        }
    
        expect("llaveCierre"); // }
    }
    

    function concatenacion() {
        // Procesar el primer término de la expresión
        TERM(); // Aquí asumes que TERM procesa términos como cadenas o identificadores
    
        // Verificar que solo haya operadores de concatenación "+"
        while (tokens[currentIndex]?.type === "operadorAritmetico") {
            const operador = tokens[currentIndex]?.value;
    
            // Solo permitir el operador "+"
            if (operador !== "+") {
                throw new Error(`Error sintáctico: El operador '${operador}' no es permitido en una concatenación (solo se permite '+') en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
    
            currentIndex++; // Avanzar al siguiente operador
            TERM(); // Procesar el siguiente término
        }
    }
    
    
    let isMainDeclared = false;  // Variable global para verificar si "Main" ya fue declarado

// Función independiente para declarar el método Main
function DECLARACION_MAIN() {
    expect("modificadoresAcceso");
    if (tokens[currentIndex]?.type !== "static") {
        throw new Error(`Error sintáctico: Se esperaba 'static' en la declaración de 'Main' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
    }
    currentIndex++; // Avanza al siguiente token después de 'static'
    // Verifica el tipo de retorno (debe ser 'void' para Main)
    const returnType = tokens[currentIndex]?.value;
    if (returnType !== "void") {
        throw new Error(
            `Error sintáctico: El método 'Main' debe ser de tipo 'void', encontrado '${returnType}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
        );
    }
    currentIndex++; // Avanza al siguiente token después de 'void'

    // Verifica el identificador (el nombre del método debe ser "Main")
    const methodName = tokens[currentIndex]?.value;
    if (methodName !== "Main") {
        throw new Error(
            `Error sintáctico: Se esperaba 'Main' como nombre de método, encontrado '${methodName}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
        );
    }
    currentIndex++; // Avanza al siguiente token después de 'Main'
    
    // Asegura que solo haya una declaración del método 'Main'
    if (isMainDeclared) {
        throw new Error("Error: El método 'Main' ya ha sido declarado.");
    }
    isMainDeclared = true;  // Marca que 'Main' ha sido declarado

    // Verifica el paréntesis de apertura (debe haber paréntesis después del nombre de 'Main')
    expect("parentesisApertura");

    // Verifica que el parámetro sea exactamente "string[]" seguido de "args"
    // Verifica que el tipo del parámetro sea "string[]"
    if (tokens[currentIndex]?.value !== "string" || tokens[currentIndex + 1]?.value !== "[]") {
        throw new Error(
            `Error sintáctico: Se esperaba 'string[]' como tipo de parámetro, encontrado '${tokens[currentIndex]?.value} ${tokens[currentIndex + 1]?.value}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
        );
    }
    currentIndex += 2; // Avanza después de "string[]"

    // Verifica que el siguiente token sea el identificador 'args'
    if (tokens[currentIndex]?.type !== "palabraReservada" || tokens[currentIndex]?.value !== "args") {
        throw new Error(
            `Error sintáctico: Se esperaba el identificador 'args', encontrado '${tokens[currentIndex]?.value}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
        );
    }
    currentIndex++; // Avanza después de "args"

    // Verifica que no haya más parámetros ni comas, ya que solo debe haber 'string[] args'
    if (tokens[currentIndex]?.type === "delimitador" || tokens[currentIndex]?.type === "identificador" || tokens[currentIndex]?.type === "palabraReservada") {
        throw new Error(
            "Error sintáctico: El método 'Main' solo puede aceptar el parámetro 'string[] args'."
        );
    }

    // Verifica el paréntesis de cierre
    expect("parentesisCierre");

    // Verifica el bloque de código (debe ser un bloque de código vacío o con instrucciones dentro)
    BLOQUE_CODIGO();  // 'Main' no debe devolver nada, por lo que 'false' es adecuado aquí
}






    let isClassDeclarado=false;
    function DECLARACION_CLASS(){
        expect("palabraReservada");
        expect("identificador");
        BLOQUE_CODIGO_CLASS();
        if (isClassDeclarado) {
            throw new Error("Error:La clase ya ha sido creada.");
        }
        isClassDeclarado = true;
    }

    function BLOQUE_CODIGO_CLASS() {
        expect("llaveApertura"); // {
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            
            DECLARACION_MAIN();
        }
        expect("llaveCierre"); // }
    }










// -------------------------------------------------------------------------------------------------------------
// METODOS COMPARTIDOS
function COMPARACION() {
    // Evaluar la primera parte de la comparación
    PROCESAR_COMPARACION();

    // Manejar operadores booleanos opcionales (AND, OR)
    while (tokens[currentIndex]?.type === "operadorBoleano") {
        currentIndex++; // Avanzar al operador booleano (&&, ||)
        PROCESAR_COMPARACION(); // Evaluar la siguiente comparación
    }
}

// Función para procesar comparaciones con o sin negación
function PROCESAR_COMPARACION() {
    // Verificar si hay un operador de negación '!'
    if (tokens[currentIndex]?.value === "!") {
        currentIndex++; // Avanzar al operador '!'
        if (tokens[currentIndex]?.type === "parentesisApertura") {
            currentIndex++; // Abrir paréntesis
            COMPARACION(); // Evaluar comparación dentro de los paréntesis
            expect("parentesisCierre"); // Verificar que se cierre el paréntesis
        } else {
            // Evaluar la comparación fuera de paréntesis
            ELEMENTO(); // Validar el primer elemento
            expect("operadorRelacional"); // Validar operador relacional
            ELEMENTO(); // Validar el segundo elemento
        }
    } else if (tokens[currentIndex]?.type === "parentesisApertura") {
        // Si la comparación comienza con un paréntesis
        currentIndex++; // Abrir paréntesis
        COMPARACION(); // Evaluar comparación dentro del paréntesis
        expect("parentesisCierre"); // Verificar que se cierre el paréntesis
    } else {
        // Evaluar comparación simple sin paréntesis ni negación
        ELEMENTO(); // Validar el primer elemento
        expect("operadorRelacional"); // Validar operador relacional
        ELEMENTO(); // Validar el segundo elemento
    }
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
       
       if (isMainDeclared && tokens[currentIndex]?.value === "class") {
        throw new Error(`Error sintáctico: No se puede declarar una clase dentro del método 'Main' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
    }
       
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            console.log("DECLARACION COMENTARIO");
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") 
            {
            if (["int", "double", "string", "bool"].includes(tokens[currentIndex]?.value)) {
                // Detecta si es una declaración de arreglo
                if (tokens[currentIndex + 1]?.type === "arrayBrackets") {
                    console.log("DECLARACION ARREGLOS");
                    DECLARACION_ARREGLOS();
                } else {
                    console.log("DECLARACION VARIABLE");
                    DECLARACION_VARIABLE();
                }
            } else if (tokens[currentIndex]?.value === "if") {
                console.log("DECLARACION IF");
                INSTRUCCION_IF(); 
            } else if (tokens[currentIndex]?.value === "do") {
                console.log("DECLARACION DO");
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "while") {
                console.log("DECLARACION WHILE");
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "switch") {
                console.log("DECLARACION SWITCH");
                INSTRUCCION_SWITCH();
            } else if (tokens[currentIndex]?.value === "for") {
                console.log("DECLARACION FOR");
                INSTRUCCION_FOR();
            } else if (tokens[currentIndex]?.value === "foreach"){
                console.log("DECLARACION FOReach");
                INSTRUCCION_FOREACH();   
            } else if (tokens[currentIndex]?.value === "try") {
                console.log("DECLARACION TRY");
                INSTRUCCION_TRYCATCH();
            } else if (tokens[currentIndex]?.value === "checked") {
                console.log("DECLARACION CHEKED");
                INSTRUCCION_CHECKED();
            } else if (tokens[currentIndex]?.value === "unchecked") {
                console.log("DECLARACION UNCHECKED");
                INSTRUCCION_UNCHECKED();
            } else if (tokens[currentIndex]?.value === "using") { // para que la recuerdes...
                console.log("DECLARACION USING");
                INSTRUCCION_USING();
            } else if (tokens[currentIndex]?.value === "class") { // para que la recuerdes...
                console.log("DECLARACION CLASS");
                DECLARACION_CLASS();
            } else if (tokens[currentIndex]?.value === "array" && tokens[currentIndex + 1]?.type === "conector" && tokens[currentIndex + 2]?.value.toLowerCase() === "copy") {
                console.log("DECLARACION ARRAY COPY");
                INSTRUCCION_ARRAY_COPY();
            } else {
                throw new Error(`Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
        } else if (tokens[currentIndex]?.type === "identificador") {
            if (
                tokens[currentIndex + 1]?.type === "asignacion" && // Verifica que haya un operador de asignación
                (
                    tokens[currentIndex + 2]?.type !== "parentesisApertura" && // No puede empezar con paréntesis de apertura
                    tokens[currentIndex + 2]?.type !== "literalNumerica" && // No puede ser una literal numérica
                    (
                        tokens[currentIndex + 2]?.type !== "identificador" || // Si es un identificador...
                        tokens[currentIndex + 3]?.type !== "operadorAritmetico" // ...entonces NO debe ser seguido por un operador aritmético
                    )
                )
            ) {
                console.log("ASIGNACION METODO");
                ASIGNACION_METODO();
            } else {
                console.log("ASIGNACION VARIABLE");
                ASIGNACION_VARIABLE();
            }
        } else if (
            tokens[currentIndex]?.value.toLowerCase() === "console" &&
            tokens[currentIndex + 1]?.type === "conector" &&
            tokens[currentIndex + 2]?.value.toLowerCase() === "writeline"
        ) {
            console.log("DECLARACION IMPRIMIR");
            INSTRUCCION_IMPRIMIR();
        } else if (
            tokens[currentIndex]?.value.toLowerCase() === "console" &&
            tokens[currentIndex + 1]?.type === "conector" &&
            tokens[currentIndex + 2]?.value.toLowerCase() === "readkey"
        ) {
            console.log("DECLARACION READKEY");
            INSTRUCCION_READKEY();
        } else if (tokens[currentIndex]?.type === "modificadoresAcceso") { // ESTA VA DENTRO DE CLASS
            if (
                tokens[currentIndex + 2]?.value === "Main" ||   //PREGUNTA SI EL NOMBRE DEL METODO ES MAIN
                tokens[currentIndex + 3]?.value === "Main"
            ) {
                console.log("DECLARACION MAIN");
                DECLARACION_MAIN();
            } else {
                console.log("DECLARACION METODO");
                DECLARACION_METODO();
            }
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