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
    // palabras reservadas
    { type: "palabraReservada", regex: /^(si|contrario|mientras|hacer|para|interruptor|caso|xdefecto|romper|comprobado|nocomprobado|intenta|atrapar|vacio|entero|doble|cadena|boleano|usando|sistema|ARREGLO|longitud|Principal|args|Clase)$/ },
    { type: "excepciones", regex: /^(Excepcion|ExcepcionDeIndiceFueraDeRango|ExcepcionDeReferenciaNula|ExcepcionDeFormato)$/ },
    { type: "modificadoresAcceso", regex: /^(publico|privado|protegido|interno)$/ },
    { type: "static", regex: /^estatico$/i },
    { type: "tipoDatoMetodo", regex: /^(vacio|entero|doble|cadena|boleano)$/ },
    { type: "toUpper", regex: /^aMayus$/i },
    { type: "toLower", regex: /^aMinus$/i },
    { type: "console", regex: /^consola$/i },
    { type: "writeline", regex: /^escribir$/i },
    { type: "readline", regex: /^leer$/i },
    { type: "readkey", regex: /^leertecla$/i },
    { type: "math", regex: /^mate$/i },
    { type: "max", regex: /^max$/i },
    { type: "min", regex: /^min$/i },
    { type: "copy", regex: /^COPIA$/i },
    { type: "return", regex: /^retorna$/i },
    // elementos de valores
    { type: "identificador", regex: /^[a-zA-Z_][a-zA-Z0-9_]*$/ },
    { type: "literalNumerica", regex: /^[0-9]+(\.[0-9]+)?(f|F)?$/ }, // Detectar números decimales correctamente
    { type: "conector", regex: /^\.$/ }, // Punto como separador general
    { type: "literalCadena", regex: /^"([^"]*)"$/ }, // Aceptar espacios y caracteres especiales dentro de comillas
    { type: "literalBooleana", regex: /^(verdadero|falso)$/ }, // Booleanos
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
    { type: "sumaResta", regex: /^[+\-]$/ },
    
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
                console.log(`${tokenType},"${word}", Línea: ${lineNumber + 1}`);//MOSTRAR EN CONSOLA LOS TOKENS
                
            } else {
                errors.push(`Token no reconocido en la línea ${lineNumber + 1}: "${word}"`);
            }
        });
    });
    return { tokens, errors };
}


// ---------------------------------------- -Parser- ------------------------------------------------
function parse(tokens) 
{
    let currentIndex = 0;
    function expect(expectedType) {
        if (currentIndex < tokens.length && tokens[currentIndex].type === expectedType) {
            return tokens[currentIndex++];
        }
        // le tuve que poner -2 para que estuviera acorde a la linea en el textarea
        throw new Error(`Error sintáctico: Se esperaba un token de tipo ${expectedType} en la línea ${tokens[currentIndex-2]?.line || "desconocida"}`);
    }

     /*
    // Función para esperar y verificar el tipo y valor de un token
    function expect(tipo, valor) {
        if (tokens[currentIndex]?.type !== tipo || (valor && tokens[currentIndex]?.value !== valor)) {
            throw new Error(`Error sintáctico: Se esperaba un token de tipo ${tipo}${valor ? ` con valor "${valor}"` : ''}, pero se encontró ${tokens[currentIndex]?.type} en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
        currentIndex++; // Avanzamos al siguiente token
    }
    
    */

    // ---------------------------------------------------------------------------------------------
    // es la instrucion que permite hacer comentarios simples
    function INSTRUCCION_COMENTARIO() {
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            currentIndex++;
        } else {
            throw new Error(`Error sintáctico: Comentario no válido en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
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

  // -------------- aqui van las otras instrucciones (si existen)

    function INSTRUCCION_IMPRIMIR() {
        // Verificar que sea "console"
        if (tokens[currentIndex]?.value.toLowerCase() === "consola") {
            currentIndex++; // Avanzar a "console"
            expect("conector"); // Verificar el conector "."
            
            // Verificar que sea "writeline"
            if (tokens[currentIndex]?.value.toLowerCase() === "escribir") {
                currentIndex++; // Avanzar a "writeline"
            } else {
                throw new Error(`Error sintáctico: Se esperaba 'escribir' después de 'consola.' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }
            expect("parentesisApertura"); // Verificar el paréntesis de apertura "("
            concatenacion();
            expect("parentesisCierre"); // Verificar el paréntesis de cierre ")"
            expect("delimitador"); // Verificar el punto y coma ";"
        } else {
            throw new Error(`Error sintáctico: Se esperaba 'consola' al inicio de la instrucción en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
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





    function INSTRUCCION_IF() {
        expect("palabraReservada"); // if
        expect("parentesisApertura"); // (
        COMPARACION(); // Evaluamos la condición del if
        expect("parentesisCierre"); // )
        BLOQUE_CODIGO(); // Bloque principal del if
        // Procesar múltiples bloques "else if"
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.value === "contrario" &&
            tokens[currentIndex + 1]?.value === "si"
        ) {
            expect("palabraReservada"); // else
            expect("palabraReservada"); // if
            expect("parentesisApertura"); // (
            COMPARACION(); // Evaluamos la condición del else if
            expect("parentesisCierre"); // )
            BLOQUE_CODIGO(); // Bloque del else if
        }

        // Procesar bloque "else" (opcional)
        if (currentIndex < tokens.length && tokens[currentIndex]?.value === "contrario") {
            expect("palabraReservada"); // else
            BLOQUE_CODIGO(); // Bloque del else
        }
    }






    function INSTRUCCION_WHILE() {
        if (tokens[currentIndex]?.value === "hacer") {
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
        if (tokens[currentIndex]?.type === "palabraReservada" && ["entero", "doble", "cadena", "boleano"].includes(tokens[currentIndex]?.value)) {
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



    function INSTRUCCION_SWITCH() {
        expect("palabraReservada"); // switch
        expect("parentesisApertura"); // (
        ELEMENTO(); // Expresión del switch
        expect("parentesisCierre"); // )
        expect("llaveApertura"); // {
        
        // Procesar casos
        while (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "caso") {
            INSTRUCCION_CASE();
        }

        // Procesar default si existe
        if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "xdefecto") {
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
            if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "romper") {
                expect("palabraReservada"); // break
                expect("delimitador"); // ;
                break;
            }
        }
    }

    function INSTRUCCION_DEFAULT() {
        expect("palabraReservada"); // default
        expect("bloqueCodigo"); // :
        
        // Procesar instrucciones dentro del case
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type !== "palabraReservada" &&
            tokens[currentIndex]?.type !== "llaveCierre"
        ) {
            INSTRUCCION();

            // Procesar break si existe
            if (tokens[currentIndex]?.type === "palabraReservada" && tokens[currentIndex]?.value === "romper") {
                expect("palabraReservada"); // break
                expect("delimitador"); // ;
                break;
            }
        }

    }




    function INSTRUCCION_CHECKED() {
        expect("palabraReservada"); // checked
        BLOQUE_CODIGO(); // Bloque de código protegido contra desbordamientos
    }

    function INSTRUCCION_UNCHECKED() {
        expect("palabraReservada"); // unchecked
        BLOQUE_CODIGO(); // Bloque de código que permite desbordamientos
    }





    function INSTRUCCION_TRYCATCH() {
        expect("palabraReservada"); // try
        BLOQUE_CODIGO(); // Bloque asociado al try

        // Procesar uno o más bloques "catch"
        while (
            currentIndex < tokens.length &&
            tokens[currentIndex]?.type === "palabraReservada" &&
            tokens[currentIndex]?.value === "atrapar"
        ) {
            expect("palabraReservada"); // catch
            expect("parentesisApertura"); // (

            if (
                tokens[currentIndex]?.type === "excepciones" &&
                ["Excepcion", "ExcepcionDeIndiceFueraDeRango", "ExcepcionDeReferenciaNula", "ExcepcionDeFormato"].includes(tokens[currentIndex]?.value)
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
    }



    function INSTRUCCION_READKEY() {
        expect("console"); // console.readkey;
        expect("conector"); // console.readkey;
        expect("readkey"); // console.readkey;
        expect("parentesisApertura"); // (
        expect("parentesisCierre"); // )
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


    function INVOCACION_METODO() {
        expect("identificador"); // metodo;
        expect("parentesisApertura"); // (
        expect("parentesisCierre"); // )
        expect("delimitador"); // ;
    }







    function DECLARACION_VARIABLE() 
    {
        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["entero", "doble", "cadena", "boleano"].some((t) =>
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
                                (tipoDato.startsWith("entero") && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("doble") && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("cadena") && tokens[currentIndex]?.type === "literalCadena") ||
                                (tipoDato.startsWith("boleano") && ["verdadero", "falso"].includes(tokens[currentIndex]?.value))
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
                            (tipoDato === "entero" && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "doble" && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "cadena" && tokens[currentIndex]?.type === "literalCadena") ||
                            (tipoDato === "boleano" && ["verdadero", "falso"].includes(tokens[currentIndex]?.value))
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
            ["entero", "doble", "cadena", "boleano"].includes(tokens[currentIndex]?.value)
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
                    (tipoDato === "entero" && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                    (tipoDato === "doble" && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                    (tipoDato === "cadena" && tokens[currentIndex]?.type === "literalCadena") ||
                    (tipoDato === "boleano" && ["verdadero", "falso"].includes(tokens[currentIndex]?.value))
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
            if (tokens[currentIndex]?.value.toLowerCase() === "consola" && 
            tokens[currentIndex + 1]?.type === "conector" && 
            tokens[currentIndex + 2]?.value.toLowerCase() === "leer") 
            {
                currentIndex++; // Avanza a "console"
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "ReadLine"
                expect("parentesisApertura"); // Verifica el paréntesis de apertura
                expect("parentesisCierre"); // Verifica el paréntesis de cierre
            }
            // Caso: entero.parsear(consola.leer())
            else if (
            (tokens[currentIndex]?.value.toLowerCase() === "entero" || tokens[currentIndex]?.value.toLowerCase() === "doble") &&
            tokens[currentIndex + 1]?.type === "conector" && 
            tokens[currentIndex + 2]?.value === "parsear") 
            {
                currentIndex++; // Avanza a "entero" o "doble"
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "parsear"
                expect("parentesisApertura"); // Verifica el paréntesis de apertura

                // Verifica consola.leer()
                if (tokens[currentIndex]?.value.toLowerCase() === "consola" && 
                    tokens[currentIndex + 1]?.type === "conector" && 
                    tokens[currentIndex + 2]?.value.toLowerCase() === "leer") 
                {
                    currentIndex++; // Avanza a "consola"
                    expect("conector"); // Verifica el conector '.'
                    currentIndex++; // Avanza a "leer"
                    expect("parentesisApertura"); // Verifica el paréntesis de apertura
                    expect("parentesisCierre"); // Verifica el paréntesis de cierre
                } else {
                throw new Error(`Error sintáctico: Se esperaba 'consola.leer()' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
            }

            expect("parentesisCierre"); // Verifica el paréntesis de cierre
            }
            // Caso: Math.Max(a, b) o Math.Min(a, b)
             else if (tokens[currentIndex]?.type === "math" && 
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
                    tokens[currentIndex + 2]?.value === "longitud") 
            {
                currentIndex++; // Avanza al identificador (array)
                expect("conector"); // Verifica el conector '.'
                currentIndex++; // Avanza a "length"
                // No hay paréntesis, así que no se requiere más validación
                if(tokens[currentIndex]?.value === "+" || tokens[currentIndex]?.value === "-"){
                    currentIndex++; // Avanza a + o -
                    ELEMENTO();
                }
                
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
        if (tokens[currentIndex]?.type === "identificador") 
        {
            const variable = tokens[currentIndex].value;
            currentIndex++; // Avanza al siguiente token
            
            expect("asignacion");// Verifica el operador de asignación '='
            EXPRESION();// Valida la expresión
            expect("delimitador");// Verifica el delimitador ';'

            // Si se encuentra una declaración aritmética, generamos el árbol binario
            //const arbolSintactico = analizarSintaxis(tokens);
            //mostrarArbolSintactico(arbolSintactico, linea);
            //aceptarSemanticaPorLinea[currentIndex] = true; // Activar semántica para esta línea
        } else {
            //aceptarSemanticaPorLinea[currentIndex] = false; // Desactivar semántica para esta línea
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
    /*
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
    */










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
            ["vacio", "entero", "doble", "cadena", "boleano"].includes(returnType)
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
            ["entero", "doble", "cadena", "boleano"].includes(tokens[currentIndex]?.value)) {
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
        BLOQUE_CODIGO_RETORNABLE(returnType !== "vacio");
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


  // -----------------------------------------------------








    function DECLARACION_VARIABLE_ESTATICA() 
    {
        // Primero, verificar que el siguiente token sea "static"
        if (tokens[currentIndex]?.type === "static") {
            currentIndex++; // Avanzamos al siguiente token, que debería ser el tipo de dato
        } else {
            throw new Error(
                `Error sintáctico: Se esperaba la palabra reservada 'static' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }

        if (
            tokens[currentIndex]?.type === "palabraReservada" &&
            ["entero", "doble", "cadena", "boleano"].some((t) =>
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
                                (tipoDato.startsWith("entero") && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("doble") && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                                (tipoDato.startsWith("cadena") && tokens[currentIndex]?.type === "literalCadena") ||
                                (tipoDato.startsWith("boleano") && ["verdadero", "falso"].includes(tokens[currentIndex]?.value))
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
                            (tipoDato === "entero" && tokens[currentIndex]?.type === "literalNumerica" && !tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "doble" && tokens[currentIndex]?.type === "literalNumerica" && tokens[currentIndex].value.includes(".")) ||
                            (tipoDato === "cadena" && tokens[currentIndex]?.type === "literalCadena") ||
                            (tipoDato === "boleano" && ["verdadero", "falso"].includes(tokens[currentIndex]?.value))
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










    let isUsingDeclarado = false;
    function INSTRUCCION_USING() {
        console.log("DECLARACION USING");
        expect("palabraReservada"); // using;
        expect("palabraReservada"); // system;
        expect("delimitador"); // ;
        if (isUsingDeclarado) {
            throw new Error("Error:El usando ya ha sido creado.");
        }
        isUsingDeclarado = true;

        console.log("DECLARACION CLASS");
        DECLARACION_CLASS();
    }

    let isClassDeclarado = false;
    function DECLARACION_CLASS() {
        expect("palabraReservada"); // Palabra clave para declarar la clase
        expect("identificador");    // Nombre de la clase
    
        if (isClassDeclarado) {
            throw new Error("Error: La clase ya ha sido creada.");
        }
        isClassDeclarado = true;
    
        expect("llaveApertura"); // Apertura del cuerpo de la clase

        DECLARACION_MAIN();
    
        while (tokens[currentIndex]?.type !== "llaveCierre") { // Procesar hasta encontrar la llave de cierre
            if (tokens[currentIndex]?.type === "modificadoresAcceso") {
                console.log("DECLARACION METODO");
                DECLARACION_METODO();
            } else if (tokens[currentIndex]?.type === "static") {
                console.log("DECLARACION VARIABLE");
                DECLARACION_VARIABLE_ESTATICA();
            } else {
                throw new Error(
                    `Error sintáctico: Instrucción no válida dentro de la clase en la línea ${tokens[currentIndex]?.line || "desconocida"}`
                );
            }
        }
    
        expect("llaveCierre"); // Cierre del cuerpo de la clase
    }
    


    let isMainDeclared = false;  // Variable global para verificar si "Main" ya fue declarado
    // Función independiente para declarar el método Main
    function DECLARACION_MAIN() {
        if (isMainDeclared) {
            throw new Error("Error: El método 'PRINCIPAL' ya ha sido declarado.");
        }
        isMainDeclared = true;  // Marca que 'Main' ha sido declarado

        expect("modificadoresAcceso");
        if (tokens[currentIndex]?.type !== "static") {
            throw new Error(`Error sintáctico: Se esperaba 'static' en la declaración de 'Main' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
        currentIndex++; // Avanza al siguiente token después de 'static'
        // Verifica el tipo de retorno (debe ser 'void' para Main)
        const returnType = tokens[currentIndex]?.value;
        if (returnType !== "vacio") {
            throw new Error(
                `Error sintáctico: El método 'Main' debe ser de tipo 'void', encontrado '${returnType}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
        currentIndex++; // Avanza al siguiente token después de 'void'

        // Verifica el identificador (el nombre del método debe ser "Main")
        const methodName = tokens[currentIndex]?.value;
        if (methodName !== "Principal") {
            throw new Error(
                `Error sintáctico: Se esperaba 'Main' como nombre de método, encontrado '${methodName}' en la línea ${tokens[currentIndex]?.line || "desconocida"}`
            );
        }
        currentIndex++; // Avanza al siguiente token después de 'Main'
        
        // Asegura que solo haya una declaración del método 'Main'
        

        // Verifica el paréntesis de apertura (debe haber paréntesis después del nombre de 'Main')
        expect("parentesisApertura");

        // Verifica que el parámetro sea exactamente "string[]" seguido de "args"
        // Verifica que el tipo del parámetro sea "string[]"
        if (tokens[currentIndex]?.value !== "cadena" || tokens[currentIndex + 1]?.value !== "[]") {
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
                "Error sintáctico: El método 'PRINCIPAL' solo puede aceptar el parámetro 'cadena[] args'."
            );
        }

        // Verifica el paréntesis de cierre
        expect("parentesisCierre");

        // Verifica el bloque de código (debe ser un bloque de código vacío o con instrucciones dentro)
        BLOQUE_CODIGO();  // 'Main' no debe devolver nada, por lo que 'false' es adecuado aquí
    }

    // ------------------------------------------------------------------------------------------------------------------------------
    function INSTRUCCION() {
       
       if (isMainDeclared && tokens[currentIndex]?.value === "CLASE") {
        throw new Error(`Error sintáctico: No se puede declarar una clase dentro del método 'Main' en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
    }
       
        if (tokens[currentIndex]?.type === "comentarioLinea") {
            console.log("DECLARACION COMENTARIO");
            INSTRUCCION_COMENTARIO();
        } else if (tokens[currentIndex]?.type === "palabraReservada") 
            {
            if (["entero", "doble", "cadena", "boleano"].includes(tokens[currentIndex]?.value)) {
                // Detecta si es una declaración de arreglo
                if (tokens[currentIndex + 1]?.type === "arrayBrackets") {
                    console.log("DECLARACION ARREGLOS");
                    DECLARACION_ARREGLOS();
                } else {
                    console.log("DECLARACION VARIABLE");
                    DECLARACION_VARIABLE();
                }
            } else if (tokens[currentIndex]?.value === "si") {
                console.log("DECLARACION IF");
                INSTRUCCION_IF(); 
            } else if (tokens[currentIndex]?.value === "hacer") {
                console.log("DECLARACION DO");
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "mientras") {
                console.log("DECLARACION WHILE");
                INSTRUCCION_WHILE();
            } else if (tokens[currentIndex]?.value === "interruptor") {
                console.log("DECLARACION SWITCH");
                INSTRUCCION_SWITCH();
            } else if (tokens[currentIndex]?.value === "para") {
                console.log("DECLARACION FOR");
                INSTRUCCION_FOR();
            } else if (tokens[currentIndex]?.value === "intenta") {
                console.log("DECLARACION TRY");
                INSTRUCCION_TRYCATCH();
            } else if (tokens[currentIndex]?.value === "comprobado") {
                console.log("DECLARACION CHEKED");
                INSTRUCCION_CHECKED();
            } else if (tokens[currentIndex]?.value === "nocomprobado") {
                console.log("DECLARACION UNCHECKED");
                INSTRUCCION_UNCHECKED();
            } else if (tokens[currentIndex]?.value === "ARREGLO") {
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
                console.log("ASIGNACION FUNCIONES");
                ASIGNACION_METODO();
            } else if(tokens[currentIndex + 1]?.type === "parentesisApertura"){
                console.log("INVOCACION METODO");
                INVOCACION_METODO();
            } else {
                console.log("ASIGNACION VARIABLE");
                ASIGNACION_VARIABLE();
            }
        } else if (
            tokens[currentIndex]?.value.toLowerCase() === "consola" &&
            tokens[currentIndex + 1]?.type === "conector" &&
            tokens[currentIndex + 2]?.value.toLowerCase() === "escribir"
        ) {
            console.log("DECLARACION IMPRIMIR");
            INSTRUCCION_IMPRIMIR();
        } else if (
            tokens[currentIndex]?.value.toLowerCase() === "consola" &&
            tokens[currentIndex + 1]?.type === "conector" &&
            tokens[currentIndex + 2]?.value.toLowerCase() === "leertecla"
        ) {
            console.log("DECLARACION READKEY");
            INSTRUCCION_READKEY();
        } else if (tokens[currentIndex]?.type === "modificadoresAcceso") { // ESTA VA DENTRO DE CLASS
            console.log("DECLARACION METODO");
            DECLARACION_METODO(); 
        } else {
            throw new Error(`Error sintáctico: Instrucción no válida en la línea ${tokens[currentIndex]?.line || "desconocida"}`);
        }
    }
    // ------------------------------
    while (currentIndex < tokens.length) {
        INSTRUCCION_USING();
    }
}

// --------------------------------------------------------------------------------------------
// Analizar código

let todoBien = false;

function analyzeCode() {
    const codeInput = document.getElementById("input").value;
    const output = document.getElementById("output");
    output.innerHTML = "";

    const { tokens, errors } = tokenize(codeInput);

    // Mostrar tokens en la tabla
    mostrarTokensEnTabla(tokens);

    if (errors.length > 0) {
        output.innerHTML = errors[0]; // Mostrar solo el primer error
        return;
    }

    try {
        parse(tokens);
        output.innerHTML = "El codigo es valido.";
        // aqui debe de traducir el codigo:
        
        todoBien = true;
    } catch (e) {
        todoBien = false;
        output.innerHTML = e.message; // Mostrar error sintáctico
    }
}


function TraducirCMICHI(){
    if(todoBien == true){
        const codigoEntrada = document.getElementById("input").value;
        const codigoTraducido = traducirCodigo(codigoEntrada);
        descargarArchivo("codigo.cs", codigoTraducido);
    } 

}






// analisis lexico
function mostrarTokensEnTabla(tokens) {
    const tablaTokens = document.getElementById("tablaTokens").getElementsByTagName('tbody')[0];

    // Limpiar la tabla antes de agregar los nuevos tokens
    tablaTokens.innerHTML = "";

    // Iterar sobre los tokens y agregarlos a la tabla
    tokens.forEach(token => {
        const fila = tablaTokens.insertRow();

        // Celda para el número de línea
        const celdaLinea = fila.insertCell(0);
        celdaLinea.textContent = token.line;

        // Celda para el tipo de token
        const celdaTipo = fila.insertCell(1);
        celdaTipo.textContent = token.type;

        // Celda para el valor del token
        const celdaValor = fila.insertCell(2);
        celdaValor.textContent = token.value;
    });
}

//FUNCION PRINCIPAL
function analizar() {
    analyzeCode();
    
    const tablaSintactico = document.getElementById('tablaSintactico').getElementsByTagName('tbody')[0];
    tablaSintactico.innerHTML = "";  // Esto limpiará las filas de la tabla
    //validarSintaxis(tokensPorLinea);
    MostrarSemantica(input);
}







































// Diccionario para traducción
const diccionario = {
    "usando": "using",
    "sistema": "System",
    "Programa": "Program",
    "estatico": "static",
    "vacio": "void",
    "Principal":"Main",
    "cadena": "string",
    "argumentos":"args",
    "consola":"Console",
    "escribir":"WriteLine",
    "si":"if",
    "contrario":"else",
    "mientras":"while",
    "hacer":"do",
    "para":"for",
    "interruptor":"switch",
    "caso":"case",
    "xdefecto":"default",
    "romper":"break",
    "comprobado":"checked",
    "nocomprobado":"unchecked",
    "intenta":"try",
    "atrapar":"catch",
    "vacio":"void",
    "entero":"int",
    "doble":"double",
    "cadena":"string",
    "boleano":"bool",
    "usando":"using",
    "ARREGLO":"Array",
    "longitud":"length",
    "Principal":"Main",
    "args":"args",
    "Clase":"class",
    "Excepcion":"Exception",
    "ExcepcionDeIndiceFueraDeRango":"IndexOutOfRangeException",
    "ExcepcionDeReferenciaNula":"NullReferenceException",
    "ExcepcionDeFormato":"FormatException",
    "aMayus":"toUpper",
    "aMinus":"toLower",
    "leer":"ReadLine",
    "leertecla":"ReadKey",
    "mate":"Math",
    "max":"Max",
    "min":"Min",
    "COPIA":"Copy",
    "retorna":"return",
    "parsear":"Parse",
    "publico":"public",
    "protegido":"protected",
    "privado":"private",
    "interno":"internal"
  
  
  };
  
    
    // Función de traducción
    function traducirCodigo(codigo) {
      const lineas = codigo.split("\n");
      return lineas.map(linea => {
        Object.keys(diccionario).forEach(palabra => {
          const regex = new RegExp(`\\b${palabra}\\b`, "g");
          linea = linea.replace(regex, diccionario[palabra]);
        });
        return linea;
      }).join("\n");
    }
    
    // Descargar archivo
    function descargarArchivo(nombre, contenido) {
      const enlace = document.createElement("a");
      const blob = new Blob([contenido], { type: "text/plain" });
      enlace.href = URL.createObjectURL(blob);
      enlace.download = nombre;
      enlace.click();
    }
    






































































// Boton nuevo


let nombreArchivoActual = null; // Variable para almacenar el nombre del archivo cargado

// Función para guardar contenido
function guardarContenido() {
    // Obtén el contenido del textarea
    const contenido = document.getElementById('input').value;

    // Obtén el mensaje del contenedor de errores
    let mensajeErrores = document.getElementById('output').innerText;

    // Si el mensaje de errores está vacío o no contiene "Sintaxis correcta", analizamos de nuevo
    if (!mensajeErrores.trim() || !mensajeErrores.includes('El codigo es valido')) {
        analizar();  // Realiza el análisis
        mensajeErrores = document.getElementById('output').innerText;  // Actualiza los errores
    }

    // Validamos los errores de sintaxis después de reanalizar
    if (mensajeErrores.includes('El codigo es valido')) {
        guardarArchivo(contenido);  // Guarda si la sintaxis es correcta
    } else if (!mensajeErrores.includes('El codigo es valido')) {
        alert('No se puede guardar el archivo debido a errores de sintaxis.');
    } else {
        alert('Error: No se pudo determinar el estado de la sintaxis.');
    }
}

// Función para guardar el archivo
function guardarArchivo(contenido) {
    // Si no hay un archivo abierto, solicita un nombre
    if (!nombreArchivoActual) {
        nombreArchivoActual = prompt('Introduce un nombre para el archivo:', 'nuevoArchivo.CM');
        if (!nombreArchivoActual) {
            alert('El nombre del archivo no puede estar vacío.');
            return;
        }
    }

    // Crea un Blob con el contenido y especifica el tipo MIME
    const blob = new Blob([contenido], { type: 'text/plain' });

    // Crea un enlace para descargar el archivo
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivoActual; // Usa el nombre del archivo actual

    // Simula un clic en el enlace para iniciar la descarga
    enlace.click();

    // Libera la memoria utilizada por el objeto URL
    URL.revokeObjectURL(enlace.href);

    alert(`Archivo "${nombreArchivoActual}" guardado exitosamente.`);

    // Limpia el nombre del archivo después de guardar
    nombreArchivoActual = null;
}

// Asocia la función al evento click del botón "Guardar"
document.getElementById('guardar').addEventListener('click', guardarContenido);

// Asocia el evento click al botón "Abrir" para mostrar el selector de archivo
document.getElementById('abrir').addEventListener('click', function () {
    // Dispara el evento de clic en el input oculto
    document.getElementById('archivo').click();
});

// Asocia el evento change al input de archivo para cargar el contenido
document.getElementById('archivo').addEventListener('change', function (event) {
    const archivo = event.target.files[0]; // Obtiene el archivo seleccionado

    if (archivo) {
        const lector = new FileReader(); // Crea un lector de archivos

        lector.onload = function (e) {
            const contenido = e.target.result; // Obtiene el contenido del archivo
            document.getElementById('input').value = contenido; // Carga el contenido en el textarea
            nombreArchivoActual = archivo.name; // Guarda el nombre del archivo cargado
        };

        lector.onerror = function () {
            alert('Error al leer el archivo.');
        };

        lector.readAsText(archivo); // Lee el archivo como texto
    } else {
        alert('No se seleccionó ningún archivo.');
    }
});



// Boton nuevo

// Función para manejar el clic en el botón "Nuevo"
document.querySelector('a.dropdown-item[href="#"]').addEventListener('click', function() {
    // Limpia el contenido del textarea
    document.getElementById('input').value = '';

    // Limpia el nombre del archivo actual
    nombreArchivoActual = null;

    // Limpia los errores de sintaxis
    document.getElementById('erroresSintaxis').innerText = '';

    // Opcional: Cambia el estado de los tabs (por si necesitas volver a mostrar los resultados de análisis)
    document.getElementById('tab-lexico').style.display = 'none';
    document.getElementById('tab-sintactico').style.display = 'none';
    document.getElementById('tab-semantico').style.display = 'none';
});
























//-------------------------------------------------------------------------------------------------------------------------------


function mostrarTokens(tokensPorLinea) {
    const tablaTokens = document.getElementById("tablaTokens").getElementsByTagName('tbody')[0];
    tablaTokens.innerHTML = ""; // Limpiar tabla

    tokensPorLinea.forEach(lineaObj => {
        const { linea, tokens } = lineaObj;

        let filaInicial = null;
        let rowspan = 0;

        tokens.forEach((tokenObj, index) => {
            const { tipo, valor } = tokenObj;
            const fila = tablaTokens.insertRow();
            const celdaLinea = fila.insertCell(0);
            const celdaToken = fila.insertCell(1);
            const celdaTipo = fila.insertCell(2);

            if (index === 0) {
                celdaLinea.textContent = "linea " + linea;
                filaInicial = fila;
                rowspan = 1;
            } else {
                celdaLinea.style.display = "none"; // Ocultar celdas no usadas
                rowspan++;
            }

            celdaToken.textContent = valor;
            celdaTipo.textContent = tipo;

            // Ajustar el rowspan de la celda de línea si es el último token en la línea
            if (index === tokens.length - 1) {
                filaInicial.cells[0].rowSpan = rowspan;
            }
        });
    });
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// --------------------ANALISIS SINTACTICO (GRAMATICO )-----------------------
let esFor = false;
let aceptarSemanticaPorLinea = [];

function validarSintaxis(tokensPorLinea) {
    const divErrores = document.getElementById("erroresSintaxis");
    divErrores.innerHTML = ""; // Limpiar el contenido previo
    let hayError = false;

    aceptarSemanticaPorLinea = []; // Reiniciar la lista de validaciones semánticas

    tokensPorLinea.forEach((lineaObj, index) => {
        const { linea, tokens } = lineaObj;
        let tiposPresentes = tokens.map(token => token.tipo);

        // -------------------------------------------------------------------------------------

         // Verificar si es una operación aritmética
         const operadoresAritmeticos = ["Operador de Suma", "Operador de Resta", "Operador de Multiplicacion", "Operador de Division", "Operador de Comparacion", "Operador Logico"];
         const elementosVariable = ["Identificador", "Literal Numerico"];
         
         if (
             tiposPresentes[0] === "Identificador" && // Nombre de la variable
             tiposPresentes[1] === "Operador de Asignacion" && // Operador de asignación "="
             elementoOpcionalParentesis(tiposPresentes.slice(2, tokens.length - 1), operadoresAritmeticos, elementosVariable) && // Expresión válida
             tiposPresentes[tokens.length - 1] === "Delimitador" // Delimitador final ";"
         ) {
             // Si se encuentra una declaración aritmética, generamos el árbol binario
             const arbolSintactico = analizarSintaxis(tokens);
             mostrarArbolSintactico(arbolSintactico, linea);
             aceptarSemanticaPorLinea[index] = true; // Activar semántica para esta línea
         } else {
             aceptarSemanticaPorLinea[index] = false; // Desactivar semántica para esta línea
         }

    });
}








function elementoOpcionalParentesis(tokens, permitidosOperadores, permitidosElementos) {
    let stackParentesis = [];
    let esperandoElemento = true;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (esperandoElemento) {
            if (token === 'Parentesis de Apertura') {
                stackParentesis.push(token);
            } else if (permitidosElementos.includes(token)) {
                esperandoElemento = false;
            } else {
                return false; // Error: se esperaba un elemento
            }
        } else {
            if (permitidosOperadores.includes(token)) {
                esperandoElemento = true;
            } else if (token === 'Parentesis de Cierre') {
                if (stackParentesis.length === 0) {
                    return false; // Error: paréntesis de cierre sin apertura
                }
                stackParentesis.pop();
            } else {
                return false; // Error: se esperaba un operador o paréntesis de cierre
            }
        }
    }

    // Al final, no debe haber paréntesis sin cerrar y no debemos estar esperando un elemento
    return stackParentesis.length === 0 && !esperandoElemento;
}


function elementoOpcional(tokens, permitidosSeparador, permitidosElementos, vecesPermitidas) {
    if (tokens.length === 0) return true; // No hay elementos opcionales, lo cual es válido.
    let limite = vecesPermitidas === 0 ? Infinity : vecesPermitidas; // Si vecesPermitidas es 0, no hay límite en cuántas veces podemos usar los tokens
    let vecesUsadas = 0; // Cada vez que se recorre un par (separador + elemento), cuenta como 1 vez permitida

    // Recorremos los tokens en pares de separador y elemento
    for (let i = 0; i < tokens.length; i += 2) {
        // Verificamos que no se excedan las veces permitidas
        if (vecesUsadas >= limite) {
            return false; // Se ha superado el número de veces permitidas
        }

        // Verificamos que haya un separador (ej. coma, operador aritmético)
        if (!permitidosSeparador.includes(tokens[i])) {
            return false; // El separador no es válido
        }

        // Verificamos que el siguiente token sea un identificador o un literal (depende del contexto)
        if (!permitidosElementos.includes(tokens[i + 1])) {
            return false; // El elemento no es válido
        }

        vecesUsadas++;// Incrementamos las veces usadas por cada par de tokens (separador + elemento)
    }

    return true; // Todos los elementos opcionales son válidos dentro del límite
}




/*---------------Analisis sintactico para expresiones aritmeticas-------------*/

// Nodo para el árbol sintáctico
class Nodo {
  constructor(tipo, valor, hijos = []) {
      this.tipo = tipo;
      this.valor = valor;
      this.hijos = hijos;
  }
}

// Función principal para analizar la sintaxis
// Función principal para analizar la sintaxis
function analizarSintaxis(tokens) {
    
    let posicion = 0;

    function tokenActual() {
        return tokens[posicion] || null;
    }

    function avanzar() {
        posicion++;
    }

    // Función para manejar errores sintácticos
    function error(mensaje) {
        throw new Error(`Error sintáctico en el token '${tokenActual()?.valor}' (${mensaje})`);
    }

    // Producción para manejar asignaciones
    function parseAsignacion() {
        const identificador = tokenActual();

        if (identificador && identificador.tipo === "Identificador") {
            avanzar(); // Avanzamos para consumir el identificador

            if (tokenActual() && tokenActual().valor === "=") {
                const operadorAsignacion = tokenActual();
                avanzar(); // Consumimos el '='

                const expresionDerecha = parseExpr(); // Analizamos la expresión a la derecha del '='

                if (tokenActual() && tokenActual().valor === ";") {
                    avanzar(); // Consumimos el ';'

                    return new Nodo("Asignación", "=", [
                        new Nodo("Identificador", identificador.valor),
                        expresionDerecha
                    ]);
                } else {
                    error("Se esperaba ';' al final de la asignación");
                }
            } else {
                error("Se esperaba '=' después del identificador");
            }
        } else {
            error("Se esperaba un identificador al inicio de la asignación");
        }
    }

    // Producción para `expr`
    function parseExpr() {
        let nodo = parseTerm();

        while (tokenActual() && (tokenActual().valor === "+" || tokenActual().valor === "-")) {
            let operador = tokenActual();
            avanzar();
            let nodoDerecha = parseTerm();
            nodo = new Nodo("Operación", operador.valor, [nodo, nodoDerecha]);
        }

        return nodo;
    }

    // Producción para `term`
    function parseTerm() {
        let nodo = parseFactor();

        while (tokenActual() && (tokenActual().valor === "*" || tokenActual().valor === "/")) {
            let operador = tokenActual();
            avanzar();
            let nodoDerecha = parseFactor();
            nodo = new Nodo("Operación", operador.valor, [nodo, nodoDerecha]);
        }

        return nodo;
    }

    // Producción para `factor`
    function parseFactor() {
        let token = tokenActual();

        if (token.valor === "(") {
            avanzar();
            let nodo = parseExpr();
            if (tokenActual().valor === ")") {
                avanzar();
            } else {
                error("Se esperaba ')'");
            }
            return nodo;
        } else if (!isNaN(token.valor)) {
            avanzar();
            return new Nodo("Número", token.valor);
        } else if (token.tipo === "Identificador") {
            avanzar();
            return new Nodo("Identificador", token.valor);
        } else {
            error("Se esperaba un número, identificador o '('");
        }
    }

    // Comenzar el análisis verificando si se trata de una asignación
    const arbol = parseAsignacion();

    // Verificar si hay tokens restantes
    if (posicion < tokens.length) {
        error("Tokens sobrantes después del análisis sintáctico");
    }

    return arbol;
}






/*------------Mostramos arbol sintactico--------- */

function mostrarArbolSintactico(arbol, linea) {
  const width = 600;  // Ajusta el ancho según lo que necesites
  const height = 300; // Ajusta la altura según lo que necesites

  // Agregar fila con número de línea y el espacio para el árbol
  const tablaSintactico = document.getElementById('tablaSintactico').getElementsByTagName('tbody')[0];
  const nuevaFila = tablaSintactico.insertRow();
  
  const celdaLinea = nuevaFila.insertCell(0);
  const celdaArbol = nuevaFila.insertCell(1);
  
  // Insertar el número de línea en la celda
  celdaLinea.textContent = linea;
  
  // Crear un div dentro de la celda para el árbol
  const divArbol = document.createElement('div');
  divArbol.style.width = `${width}px`;   // Ajustar ancho del contenedor
  divArbol.style.height = `${height}px`; // Ajustar altura del contenedor
  celdaArbol.appendChild(divArbol);
  
  // D3.js para mostrar el árbol sintáctico dentro del div creado
  const svg = d3.select(divArbol)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(40,30)"); // Margen de 40 en el eje X

  const root = d3.hierarchy(arbol, d => d.hijos);

  const treeLayout = d3.tree().size([width - 100, height - 100]);
  const treeData = treeLayout(root);

  const nodes = svg.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  nodes.append("circle")
      .attr("r", 10);

  nodes.append("text")
      .attr("dy", ".35em")
      .attr("y", -20)
      .style("text-anchor", "middle")
      .text(d => d.data.valor);

  const links = svg.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black");
}




















// ------ ANALISIS SEMANTICO ---------
// ----------------------------------------------------------------------
function MostrarSemantica(texto) {
    const lineas = texto.split("\n");
    const tablaSemantica = document.getElementById("tablaSemantica");
    tablaSemantica.innerHTML = "";  // Limpiar la tabla antes de agregar nuevas filas

    lineas.forEach((linea, index) => {
        // Saltar líneas vacías
        if (linea.trim() === "") {
            const filaVacia = document.createElement("tr");
            const celdaLineaVacia = document.createElement("td");
            celdaLineaVacia.textContent = index + 1;
            return;  // Saltar esta iteración para no analizar líneas vacías
        }

        const resultado = analizarSemantico(linea, index);
        const fila = document.createElement("tr");
        const celdaLinea = document.createElement("td");
        celdaLinea.textContent = index + 1;

        // Crear celda para el resultado y reemplazar "\n" con "<br>"
        const celdaResultado = document.createElement("td");
        celdaResultado.innerHTML = resultado.replace(/\n/g, "<br>");

        fila.appendChild(celdaLinea);
        fila.appendChild(celdaResultado);
        tablaSemantica.appendChild(fila);
    });
}

function analizarSemantico(codigo, index) {
    if (codigo.trim() === "") {
        return "";  // Devolver cadena vacía para líneas vacías
    }
    let resultado = "";
    // Aquí analizas las asignaciones o declaraciones
    if(aceptarSemanticaPorLinea[currentIndex] == true){
        resultado = analizarAsignacion(codigo);
    }else{
        resultado = analizarInst(codigo);
    }
    // Si el resultado es vacío, al menos devolvemos un mensaje de que no se encontró semántica
    return resultado !== "" ? resultado : "Sin semántica reconocida en esta línea";
}


function desglosarExpresion(exp) {
    if (!exp || exp.trim() === "") {
        return [];  // Si la expresión está vacía, devolver un array vacío
    }

    const tokens = [];
    let tokenActual = "";

    for (let i = 0; i < exp.length; i++) {
        const char = exp[i];

        if (char.match(/[a-zA-Z]/)) {
            // Acumular letras (posible identificador)
            tokenActual += char;
        } else if (char.match(/\d/)) {
            // Acumular dígitos dentro de un identificador o número
            tokenActual += char;
        } else if (char.match(/[\+\-\*\/\(\)]/)) {
            // Detectar operadores aritméticos y paréntesis
            if (tokenActual.length > 0) {
                if (tokenActual.match(/[a-zA-Z]/)) {
                    tokens.push('id');  // Si contiene letras es un identificador
                } else {
                    tokens.push('num');  // Si solo contiene dígitos, es un número
                }
                tokenActual = "";
            }
            tokens.push(char === '(' || char === ')' ? `( exp )` : `exp ${char} exp`);
        }
    }

    // Agregar el último token si existe
    if (tokenActual.length > 0) {
        if (tokenActual.match(/[a-zA-Z]/)) {
            tokens.push('id');  // Si contiene letras es un identificador
        } else {
            tokens.push('num');  // Si solo contiene dígitos, es un número
        }
    }

    return tokens;
}

// Función para desglosar un identificador y mostrar solo 'let' para letras y 'dig' para dígitos
function desglosarIdentificador(id) {
    const tokens = [];
    let desglosado = "";

    for (const char of id) {
        if (char.match(/[a-zA-Z]/)) {
            desglosado += "let ";
        } else if (char.match(/\d/)) {
            desglosado += "dig ";
        }
    }

    tokens.push(desglosado.trim());
    return tokens;
}

// Función para desglosar identificadores dentro de una expresión (después del igual)
function desglosarIdentificadoresEnExpresion(exp) {
    const tokens = [];
    let tokenActual = "";

    for (const char of exp) {
        if (char.match(/[a-zA-Z]/)) {
            tokenActual += char;
        } else if (char.match(/\d/)) {
            tokenActual += char;
        } else {
            if (tokenActual.length > 0 && tokenActual.match(/[a-zA-Z]/)) {
                tokens.push(desglosarIdentificador(tokenActual).join(' '));  // Solo procesar identificadores
            }
            tokenActual = "";
        }
    }

    // Agregar el último identificador si existe
    if (tokenActual.length > 0 && tokenActual.match(/[a-zA-Z]/)) {
        tokens.push(desglosarIdentificador(tokenActual).join(' '));
    }

    return tokens;
}

// Función para desglosar los números por cantidad de dígitos y eliminar duplicados
function desglosarNumerosAgrupadosPorDigitos(exp) {
    const numerosAgrupados = new Set();
    let numeroActual = "";
    let esIdentificador = false;

    for (const char of exp) {
        if (char.match(/[a-zA-Z]/)) {
            esIdentificador = true;  // Si hay letras, es un identificador
        } else if (char.match(/\d/)) {
            numeroActual += "dig ";
        } else {
            if (numeroActual.length > 0 && !esIdentificador) {
                numerosAgrupados.add(numeroActual.trim()); // Agregar el número si no es identificador
            }
            numeroActual = "";
            esIdentificador = false;  // Reiniciar el estado de identificador
        }
    }

    // Añadir el último número si quedó alguno sin procesar y no es identificador
    if (numeroActual.length > 0 && !esIdentificador) {
        numerosAgrupados.add(numeroActual.trim());
    }

    return Array.from(numerosAgrupados);
}

// Función para obtener las letras y dígitos únicos del código
function obtenerLetrasDigitos(ladoIzquierdo, ladoDerecho) {
    const letras = new Set();
    const digitos = new Set();
    let hayDigitos = false;

    // Procesar lado izquierdo (variables)
    for (const char of ladoIzquierdo) {
        if (char.match(/[a-zA-Z]/)) {
            letras.add(char);
        }
    }

    // Procesar lado derecho (expresiones y números)
    for (const char of ladoDerecho) {
        if (char.match(/[a-zA-Z]/)) {
            letras.add(char);
        } else if (char.match(/\d/)) {
            digitos.add(char);
            hayDigitos = true;
        }
    }

    return {
        letras: Array.from(letras),
        digitos: hayDigitos ? Array.from(digitos) : []  // Solo devolver dígitos si existen
    };
}
















function esPalabraReservada(palabra) {
    return palabrasReservadas.hasOwnProperty(palabra);
}

function analizarInst(codigo) {
    // Primero, verificamos si hay comentarios en la línea
    if (contieneComentario(codigo)) {
        return "Sin semántica reconocida en esta línea";
    }

    let resultado = "inst -> ";  // Agregar prefijo inst -> al inicio
    let ids = [];                // Almacenamos los ids con sus componentes
    let letras = new Set();       // Para las letras de los identificadores y cadenas
    let digitos = new Set();      // Para los dígitos numéricos de los identificadores y cadenas
    let simbolos = new Set();     // Para los símbolos como '_', espacios, etc.
    let numeros = new Set();      // Para los números completos en la cadena
    let enTexto = false;  
    let textoActual = ""; 
    let tipoComillas = '';  

    for (let i = 0; i < codigo.length; i++) {
        let char = codigo[i];

        if ((char === '"' || char === "'") && !enTexto) {
            // Iniciar captura de texto entre comillas
            enTexto = true;
            tipoComillas = char;
            resultado += char;
        } else if (char === tipoComillas && enTexto) {
            // Al finalizar el texto entre comillas, transformarlo
            resultado += transformarTexto(textoActual);  // Transformar letras, dígitos y símbolos
            desglosarElementos(textoActual, letras, digitos, simbolos);  // Añadir elementos a los sets
            resultado += char;
            textoActual = "";
            enTexto = false;
        } else if (enTexto) {
            // Continuar capturando el texto entre comillas
            textoActual += char;
        } else {
            if (esLetra(char)) {
                // Detectar palabras (posibles identificadores o palabras reservadas)
                let palabra = "";
                while (i < codigo.length && esLetraODigito(codigo[i])) {
                    palabra += codigo[i];
                    i++;
                }
                i--;

                if (esPalabraReservada(palabra)) {
                    // Si es una palabra reservada, simplemente la agregamos
                    resultado += palabra;
                } else {
                    // Si es un identificador, procesarlo
                    resultado += "id";  // Representación general en la línea
                    ids.push(palabra);   // Guardar el identificador único para desglosar más tarde
                }
            } else if (esNumeroPlano(char)) {
                // Procesar números
                let numero = "";
                while (i < codigo.length && esDigito(codigo[i])) {
                    numero += codigo[i];
                    i++;
                }
                i--;
                resultado += "num";  // Representación general en la línea
                numeros.add(numero);  // Guardar el número único

                // Desglosar el número en dígitos
                for (const digito of numero) {
                    digitos.add(digito); // Guardar los dígitos
                }
            } else {
                // Para cualquier otro carácter, agregarlo tal cual
                resultado += char;
            }
        }
    }

    // Generar el desglose semántico agrupado
    let desgloseSemantico = "";

    // Desglosar los identificadores
    ids.forEach(id => {
        let desglosadoId = "";
        
        for (const char of id) {
            if (esLetra(char)) {
                letras.add(char);
                desglosadoId += "let ";
            } else if (esDigito(char)) {
                digitos.add(char);
                desglosadoId += "dig ";
            } else {
                simbolos.add(char);
                desglosadoId += "simb ";
            }
        }
        
        // Agregar la representación desglosada del identificador
        desgloseSemantico += `id -> ${desglosadoId.trim()}\n`;
    });

    // Letras de los identificadores y literales
    if (letras.size > 0) {
        desgloseSemantico += `let -> ${Array.from(letras).join(' | ')}\n`;
    }

    // Números
    if (numeros.size > 0) {
        desgloseSemantico += `num -> dig\n`;
    }

    // Dígitos
    if (digitos.size > 0) {
        desgloseSemantico += `dig -> ${Array.from(digitos).join(' | ')}\n`;
    }

    // Símbolos
    if (simbolos.size > 0) {
        desgloseSemantico += `simb -> ${Array.from(simbolos).join(' | ')}\n`;
    }

    // Retornar el resultado con el desglose semántico agrupado
    return resultado + "\n" + desgloseSemantico;
}

// Función que transforma texto entre comillas en letras, dígitos y símbolos
function transformarTexto(texto) {
    let resultado = "";
    for (const char of texto) {
        if (esLetra(char)) {
            resultado += "let";
        } else if (esDigito(char)) {
            resultado += "dig";
        } else {
            resultado += "simb";
        }
    }
    return resultado;
}

// Función que desglosa los elementos de un texto
function desglosarElementos(texto, letras, digitos, simbolos) {
    for (const char of texto) {
        if (esLetra(char)) {
            letras.add(char);
        } else if (esDigito(char)) {
            digitos.add(char);
        } else {
            simbolos.add(char);
        }
    }
}

// Funciones auxiliares para determinar el tipo de carácter
function esLetra(char) {
    return /^[a-zA-Z]$/.test(char);
}

function esDigito(char) {
    return /^[0-9]$/.test(char);
}

function esLetraODigito(char) {
    return /^[a-zA-Z0-9]$/.test(char);
}

function esPalabraReservada(palabra) {
    const palabrasReservadas = ["para", "mientras", "entero", "escribirConsola"];
    return palabrasReservadas.includes(palabra);
}

function esNumeroPlano(char) {
    return /^[0-9]$/.test(char);
}

// Función para detectar si una línea contiene un comentario
function contieneComentario(codigo) {
    // Detectar comentarios de una línea con "//"
    if (codigo.includes("//")) {
        return true;
    }

    // Detectar comentarios de bloque con "/* ... */"
    if (codigo.includes("/*") && codigo.includes("*/")) {
        return true;
    }

    return false;
}











function obtenerComponentesIdentificador(identificador) {
    const letras = [];
    const digitos = [];
    const simbolos = [];
    
    for (const char of identificador) {
        if (char.match(/[a-zA-Z]/)) {
            letras.push(char);
        } else if (char.match(/\d/)) {
            digitos.push(char);
        } else {
            simbolos.push(char);
        }
    }

    return {
        letras: Array.from(new Set(letras)),  // Evitar duplicados
        digitos: Array.from(new Set(digitos)),  // Evitar duplicados
        simbolos: Array.from(new Set(simbolos))  // Evitar duplicados
    };
}













// Función para desglosar una condición (parte entre paréntesis en "if" o "for")
function desglosarCondicion(cond) {
    let resultado = "";

    // Ejemplo básico de desglosar una condición con operadores relacionales
    const operadoresRelacionales = ['<', '>', '==', '!=', '<=', '>='];
    let tokens = [];
    let tokenActual = "";

    for (let i = 0; i < cond.length; i++) {
        const char = cond[i];

        if (char.match(/[a-zA-Z0-9]/)) {
            tokenActual += char;
        } else if (operadoresRelacionales.includes(char)) {
            if (tokenActual.length > 0) {
                tokens.push(tokenActual);
                tokenActual = "";
            }
            tokens.push(`${char}`);
        }
    }

    if (tokenActual.length > 0) {
        tokens.push(tokenActual);
    }

    resultado += tokens.join(' ');
    return resultado;
}



// Función para desglosar una asignación simple
function analizarAsignacion(codigo) {
    let resultado = "";

    // Paso 1: Dividir la proposición en el lado izquierdo (id) y el lado derecho (exp)
    const [ladoIzquierdo, ladoDerecho] = codigo.split('=').map(x => x.trim());

    // Definir que la proposición es de asignación
    resultado += "prop -> id = exp\n";

    // Desglosar la expresión (lado derecho)
    const expTokens = desglosarExpresion(ladoDerecho);
    resultado += "exp -> " + Array.from(new Set(expTokens)).join(' | ') + "\n";

    // Desglosar identificadores en ambos lados
    const idTokens = [
        ...desglosarIdentificador(ladoIzquierdo),
        ...desglosarIdentificadoresEnExpresion(ladoDerecho)
    ];
    resultado += "id -> " + Array.from(new Set(idTokens)).join(' | ') + "\n";

    // Desglosar números
    const numTokens = desglosarNumerosAgrupadosPorDigitos(ladoDerecho);
    if (numTokens.length > 0) {
        resultado += "num -> " + numTokens.join(' | ') + "\n";
    }
 
     // Paso 5: Obtener las letras y dígitos únicos usados en los identificadores y números
     const { letras, digitos } = obtenerLetrasDigitos(ladoIzquierdo, ladoDerecho);
 
     // Generar las líneas para las letras y solo para los dígitos si existen
     resultado += "let -> " + letras.join(' | ') + "\n";
     if (digitos.length > 0) {
         resultado += "dig -> " + digitos.join(' | ') + "\n";
     }

    return resultado;
}








//----------------------FUNCIONES DE LOS BOTONES---------------------------------




//FUNCION PARA LIMPIAR TODO
function limpiar() {
    //VACIAR TEXT AREA
    document.getElementById("input").value = ""; //limpia la consola
    
    //LIMPIAR LEXICO
    const tablaTokens = document.getElementById("tablaTokens").getElementsByTagName('tbody')[0];
    tablaTokens.innerHTML = ""; // Limpiar tabla
    
    //LIMPIAR SINTACTICO
    const contenedorErrores = document.getElementById("erroresSintaxis");
    contenedorErrores.innerHTML = ""; // Limpiar la consola de salida
    const tablaSintactico = document.getElementById('tablaSintactico').getElementsByTagName('tbody')[0];
    tablaSintactico.innerHTML = "";  // Esto limpiará las filas de la tabla

    //LIMPIAR SEMANTICO
    const tablaSemantica = document.getElementById("tablaSemantica");
    tablaSemantica.innerHTML = "";  // Limpiar la tabla antes de agregar nuevas filas

}

//FUNCION PARA SALIR DEL PROGRANA
function salir() {
    window.close(); // Cierra la ventana del navegador
}

//FUNCION PARA MOSTRAR LOS INTEGRANTES 
function equipo() {
    var cadInst = '// ♥♥♥INTEGRANTES DEL EQUIPO BRAVO♥♥♥\n// - Balleza Cortez Yahir Fernando\n// - Baltazar Cavazos Tania Daniela\n// - Castro Martinez Jose Angel \n// - Lerma Garcia Carlos Alberto\n// - Rocha Martinez Ricardo Javier\n// - Vega Lopez Citlali Nohemi';
    document.getElementById("input").value = cadInst;
}

//FUNCION PARA MOSTRAR TODAS LAS INSTRUCCIONES
function ingresarInstruccion() {
    let codigo = `
usando sistema;

Clase Programa{
    publico estatico vacio Principal(cadena[] args){
        // esto es un comentario...

        consola.escribir("Hola Munhacer!");
        consola.escribir(variable);
        consola.escribir("Texto " + var);

        si(variable == 5){
            // bloque de codigo
        }
        si(variable != 5){
            // condicion #1
        } contrario {
            // extra
        }
        si(a >= 5 || a <= 10 && !(chopita == misopa)){
            // condicion #1
        } contrario si (variable >= 5) {
            // condicion #2
        } contrario {
            // extra
        }

        mientras(variable > 5){
            // bloque de codigo
        }
        // ESTA YA ME SALE
        hacer {
            // bloque de codigo
        } mientras(variable > 5);

        para(i = 0; i < 5; i++){
            // bloque de codigo
        }
        para(entero i = 0; i < 5; i++){
            // bloque de codigo
        }





        interruptor(opc){
            caso 1 :
                // codigo #1
                romper;
            caso 2 : 
                // codigo #2
                romper;
            caso 3 : 
                // codigo #3
                romper;
            xdefecto :
                // codigo x
                romper;
        }


        //nocomprobado garantiza que cualquier operación que cause un overflow arrojará una excepción en lugar de permitir el "wrap-around".
        //comprobado permite que las operaciones de desbordamiento (overflow) no arrojen excepciones.
        comprobado{
            //comentario
        }
        nocomprobado{
            //comentario
        }

        intenta{
            //comentario
        } atrapar(Excepcion ex){
            //comentario
        }

        x = a + b;
        abc_123 = 1 + hola - (4 + 5);
        promedio = (5 + id3 + var)/3;
        x = (5);


        publico estatico vacio Metohacer(){
            // bloque de codigo
        }
        privado estatico entero Metohacer(entero variable){
            retorna variable;
        }


        entero variable1;
        doble variable2;
        cadena variable3;
        boleano variable4;

        entero variable_entera = 5;
        doble variable_decimal = 2.5;
        cadena variable_texto = "Hola mundo";
        boleano variable_boleana = falso;

        entero [] arregloInt = { 1, 2, 3, 4, 5 };
        doble [] arreglohaceru = { 1.2, 3.4, 5.6 };
        cadena [] arregloStr = { "Hola", "Mundo" };
        boleano [] arregloBoo = { verdadero, falso, falso, verdadero };


        mayus = txt.aMayus();
        minus = txt.aMinus();
        mayor = mate.max(5, 1);
        menor = mate.min(id, id2);
        variables = consola.leer();
        numeroVar = entero.parsear(consola.leer());
        tamanio = arreglo.longitud;
        tamanio = arreglo.longitud + 1;
        ARREGLO.COPIA(origen, destino, 6);

        publico estatico entero MetodoChikito(entero var){
            retorna var;
        }
    }

    estatico entero variable_entera = 5;

    publico estatico entero MetodoChikito(){
        retorna var;
    }

    publico estatico cadena MetodoGrande(entero var){
        retorna str;
    }
}


`;
    
    var cadInst = codigo;
    document.getElementById("input").value = cadInst;
}

//-------------------FUNCIONES EXTRA DE LA CONSOLA ---------------

// Sincronizacion de la linea de los numeros de linea en la consola.
document.getElementById('input').addEventListener('input', function() {
    const textarea = this;
    const lineas = document.getElementById('lineas');
    const lineCount = textarea.value.split('\n').length;
    let lineNumberText = '';

    for (let i = 1; i <= lineCount; i++) {
        lineNumberText += i + '<br>';
    }
    lineas.innerHTML = lineNumberText;
});

// Sincronizar el desplazamiento del textarea con el contenedor de números de línea
document.getElementById('input').addEventListener('scroll', function() {
    const textarea = this;
    const lineas = document.getElementById('lineas');
    lineas.scrollTop = textarea.scrollTop;
});

//--------------------- CAMBIO DE TEMA -----------------------
document.getElementById('tema').addEventListener('change', function() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const currentTheme = themeStylesheet.getAttribute('href');
    
    if (currentTheme === 'estiloClaro.css') {
        themeStylesheet.setAttribute('href', 'estiloOscuro.css');
    } else {
        themeStylesheet.setAttribute('href', 'estiloClaro.css');
    }
});


function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(`tab-${tabId}`).style.display = 'block';
}