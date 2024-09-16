const palabrasReservadas = {
    "equipo": "Palabra Reservada - Equipo",
    "nulo": "Palabra Reservada - Nulo",
    "Mensaje": "Palabra Reservada - Mensaje",
    "Principal": "Palabra Reservada - Principal",
    "entero": "Tipos de Dato",
    "flotante": "Tipos de Dato",
    "boleano": "Tipos de Dato",
    "caracter": "Tipos de Dato",
    "cadena": "Tipos de Dato",
    "publico": "Modificadores de Acceso",
    "privado": "Modificadores de Acceso",
    "protegido": "Modificadores de Acceso",
    "estatico": "Palabra Reservada - Estatico",
    "vacio": "Palabra Reservada - Vacio",
    "nuevo": "Palabra Reservada - Nuevo",
    "tipo": "Palabra Reservada - Tipo",
    "clase": "Palabra Reservada - Clase",
    "nombrentorno": "Palabra Reservada - Nombrentorno",
    "argumentos": "Palabra Reservada - Argumentos",
    "escribir": "Palabra Reservada - Escribir",
    "consola": "Palabra Reservada - Consola",
    "si": "Palabra Reservada - Si",
    "sino": "Palabra Reservada - Sino",
    "contrario": "Palabra Reservada - Contrario",
    "para": "Palabra Reservada - Para",
    "paracadauno": "Palabra Reservada - Paracadauno",
    "mientras": "Palabra Reservada - Mientras",
    "hacer": "Palabra Reservada - Hacer",
    "interruptor": "Palabra Reservada - Interruptor",
    "caso": "Palabra Reservada - Caso",
    "romper": "Palabra Reservada - Romper",
    "xDefecto": "Palabra Reservada - XDefecto",
    "devuelve": "Palabra Reservada - Devuelve",
    "intenta": "Palabra Reservada - Intenta",
    "atrapar": "Palabra Reservada - Atrapar",
    "lanzar": "Palabra Reservada - Lanzar",
    "Excepcion": "Palabra Reservada - Excepcion",
    "DivideEntreZeroExcepcion": "Palabra Reservada - DivideEntreZeroExcepcion",
    "esnuloovacio": "Palabra Reservada - EsNuloOVacio",
    "argumentoExcepcion": "Palabra Reservada - ArgumentoExcepcion",
    "OverflowExcepcion": "Palabra Reservada - OverflowExcepcion",
    "ejecutar": "Palabra Reservada - Ejecutar",
    "invoca": "Palabra Reservada - Invoca",
    "Metodo": "Palabra Reservada - Metodo",
    "hueco": "Palabra Reservada - Hueco",
    "es": "Palabra Reservada - Es",
    "leer": "Palabra Reservada - Leer",
    "tamanio": "Palabra Reservada - Tamanio",
    "copia": "Palabra Reservada - Copia",
    "tamanioDe": "Palabra Reservada - TamanioDe",
    "nombreDe": "Palabra Reservada - NombreDe",
    "evento": "Palabra Reservada - Evento",
    "Accion": "Palabra Reservada - Accion",
    "bloquear": "Palabra Reservada - Bloquear",
    "usando": "Palabra Reservada - Usando",
    "leerTecla": "Palabra Reservada - LeerTecla",
    "mate": "Palabra Reservada - Mate",
    "mayor": "Palabra Reservada - Mayor",
    "menor": "Palabra Reservada - Menor",
    "formatoDe": "Palabra Reservada - FormatoDe",
    "comprobado": "Palabra Reservada - Comprobado",
    "noComprobar": "Palabra Reservada - NoComprobar",
    "objeto": "Palabra Reservada - Objeto",
    "estructura": "Palabra Reservada - Estructura",
    "enumeracion": "Palabra Reservada - Enumeracion",
    "remitente": "Palabra Reservada - Remitente",
    "este": "Palabra Reservada - Este",
    "tarea": "Palabra Reservada - Tarea",
    "Sistema": "Palabra Reservada - Sistema",
    "ES": "Palabra Reservada - ES",
    // Agregar la palabra reservada al diccionario
    "tamaniode": "Palabra Reservada - Funcion TamañoDe",
    "event": "Palabra Reservada - Event",
    "NombreDe": "Palabra Reservada - NombreDe",
    "nombre": "Identificador", // Añadir nombre como identificador genérico
    /*
    //_________________________________
    "bloquear": "Palabra Reservada - Bloqueo",
    "usando": "Palabra Reservada - Usando", // Agregado para manejar 'usando'
    "leerTecla": "Palabra Reservada - leerTecla"  // Agregado para leerTecla
    */
    "leertecla": "Palabra Reservada - LeerTecla",
    "consola": "Palabra Reservada - Consola"
};

const operadores = {
    "+": "Operador de Suma",
    "-": "Operador de Resta",
    "*": "Operador de Multiplicacion",
    "/": "Operador de Division",
    "%": "Operador de Modulo",
    "=": "Operador de Asignacion",
    "+=": "Operador de Asignacion",
    "-=": "Operador de Asignacion",
    "*=": "Operador de Asignacion",
    "/=": "Operador de Asignacion",
    "%=": "Operador de Asignacion",
    "==": "Operador de Comparacion",
    "!=": "Operador de Comparacion",
    "<": "Operador de Comparacion",
    ">": "Operador de Comparacion",
    "<=": "Operador de Comparacion",
    ">=": "Operador de Comparacion",
    "&&": "Operador Logico",
    "||": "Operador Logico",
    "!": "Operador Logico",
    "++": "Operador de Incremento/Decremento",
    "--": "Operador de Incremento/Decremento"
};

const literales = {
    "verdadero": "Literal Booleano",
    "falso": "Literal Booleano",
    "nulo": "Literal Nulo"
};

const delimitadores = {
    ";": "Delimitador",
    ",": "Separador",
    ".": "Conector",
    ":": "Asignacion de Bloque de Codigo",
    "(": "Parentesis de Apertura",
    ")": "Parentesis de Cierre",
    "[": "Corchetes de Apertura",
    "]": "Corchetes de Cierre",
    "{": "Llaves de Apertura",
    "}": "Llaves de Cierre",
    ".": "Punto"
};


//-----------------------------ANALISIS LEXICO---------------------------------

function analizarTexto(texto) {
    const tokensPorLinea = [];
    const regex = /\$\{[^}]+\}|==|!=|<=|>=|&&|\|\||\+\+|--|["][^"]*["]|['][^']*[']|\/\/.*|\/\*[\s\S]*?\*\/|\d+\.\d+|\d+|[\w]+|[-+*/%=&|!<>]=?|[{}()[\],;:.@]/g;
    const lineas = texto.split('\n');


    lineas.forEach((linea, numeroLinea) => {
        const palabras = linea.match(regex);
        const lineaTokens = [];

        if (palabras) {
            palabras.forEach(palabra => {
                let tokenTipo = "Simbolo Desconocido";

                if (palabrasReservadas[palabra]) tokenTipo = palabrasReservadas[palabra];
                else if (operadores[palabra]) tokenTipo = operadores[palabra];
                else if (literales[palabra]) tokenTipo = literales[palabra];
                else if (delimitadores[palabra]) tokenTipo = delimitadores[palabra];
                else if (!isNaN(palabra)) tokenTipo = "Literal Numerico";
                else if (/^".*"$/.test(palabra) || /^'.*'$/.test(palabra)) tokenTipo = "Literal de Cadena";
                else if (/^\/\/.*$/.test(palabra)) tokenTipo = "Comentario de una linea";
                else if (/^\/\*.*\*\/$/.test(palabra)) tokenTipo = "Comentario de múltiples lineas";
                else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(palabra)) tokenTipo = "Identificador";

                lineaTokens.push({ tipo: tokenTipo, valor: palabra });
            });
        }

        if (lineaTokens.length > 0) {
            tokensPorLinea.push({ linea: numeroLinea + 1, tokens: lineaTokens });
        }

        // Mostrar en consola los tokens de la línea actual
        console.log(`Línea ${numeroLinea + 1}:`, lineaTokens);
    });

    return tokensPorLinea;
}

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


//--------------------ANALISIS SINTACTICO (GRAMATICO )------------------------

function validarSintaxis(tokensPorLinea) {
    const divErrores = document.getElementById("erroresSintaxis");
    divErrores.innerHTML = ""; // Limpiar el contenido previo
    let hayError = false;

    let enBloque = false;  // Estado que controla si estamos dentro de un bloque

    tokensPorLinea.forEach(lineaObj => {
        const { linea, tokens } = lineaObj;
        let tiposPresentes = tokens.map(token => token.tipo);

        // Verificar si estamos abriendo o cerrando un bloque
        tokens.forEach(tokenObj => {
            if (tokenObj.tipo === "Llave de Apertura") {
                enBloque = true;  // Entramos en un bloque
            } else if (tokenObj.tipo === "Llave de Cierre") {
                enBloque = false; // Salimos de un bloque
            }
        });

        // Verificar si falta algún operador, delimitador o paréntesis
        const errores = verificarElementosFaltantes(tiposPresentes, tokens, linea, enBloque);
        if (errores.length > 0) {
            errores.forEach(error => {
                divErrores.innerHTML += `<p>Error en la línea ${linea}: ${error}</p>`;
                hayError = true;
            });
            return;
        }



        //______________________________________________________________________-
        // Función para verificar si falta algún operador, delimitador o paréntesis
        function verificarElementosFaltantes(tipos, tokens, linea, enBloque) {
            let errores = [];
            // Verificar si la estructura es 'bloquear(variable){}'
            const esBloquear = tokens.length >= 6 &&
                tokens[0].valor === "bloquear" &&
                tipos[1] === "Parentesis de Apertura" &&
                tipos[2] === "Identificador" &&
                tipos[3] === "Parentesis de Cierre" &&
                tipos[4] === "Llave de Apertura" &&
                (tipos[5] === "Llave de Cierre" || (tipos.length === 5 && enBloque)); // 'Llave de Cierre' o se puede estar en un bloque

            if (esBloquear) {
                console.log("La estructura es un bloque de tipo 'bloquear(variable){}'");
            } else {
                console.log("La estructura no es un bloque de tipo 'bloquear(variable){}'");
            }

            // Si no es un bloque y la estructura no es 'bloquear', verificar delimitador
            if (!enBloque && !esBloquear) {
                const ultimoTipo = tipos[tipos.length - 1];
                if (ultimoTipo !== "Delimitador" && ultimoTipo !== "Llave de Cierre") {
                    errores.push("Falta delimitador ';'");
                }
            }

            // Verificar si falta paréntesis de apertura o cierre
            if (tipos.includes("Parentesis de Apertura") && !tipos.includes("Parentesis de Cierre")) {
                errores.push("Falta paréntesis de cierre ')'");
            }
            if (tipos.includes("Parentesis de Cierre") && !tipos.includes("Parentesis de Apertura")) {
                errores.push("Falta paréntesis de apertura '('");
            }

            // Verificar si hay operadores de asignación cuando se espera uno
            if (tipos.includes("Operador de Asignacion") && !tokens.some(token => token.tipo === "Operador de Asignacion")) {
                errores.push("Falta operador de asignación '='");
            }

            // Verificar si falta la llave de cierre después de un bloque abrir '{'
            if (enBloque && !tipos.includes("Llave de Cierre")) {
                errores.push(`Error en la línea ${linea}: Falta la llave de cierre '}' para cerrar el bloque`);
            }

            return errores;
        }


        //______________________________________________________________________



        // Verificar si es un comentario (una línea o múltiples líneas)
        if (tiposPresentes.length === 1 && (tiposPresentes[0] === "Comentario de una linea" || tiposPresentes[0] === "Comentario de múltiples lineas")) {
            return; // Es válido, no es necesario marcarlo como error
        }

        // Verificar si es una declaración de variable
        if (
            tiposPresentes.length === 5 &&
            tiposPresentes[0] === "Tipos de Dato" &&
            tiposPresentes[1] === "Identificador" &&
            tiposPresentes[2] === "Operador de Asignacion" &&
            tiposPresentes[3] === "Literal Numerico" &&
            tiposPresentes[4] === "Delimitador"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        }

        // Verificar si es la instrucción equipo();
        if (
            tiposPresentes.length === 4 &&
            tiposPresentes[0] === "Palabra Reservada - Equipo" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Parentesis de Cierre" &&
            tiposPresentes[3] === "Delimitador"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        }

        // Verificar si es la instrucción escribir.consola()


        // Verificar otras gramáticas como "while", "if", etc.
        const elementosMientras = ["Identificador", "Literal Numerico"];
        if (
            tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - Mientras" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Identificador" &&
            tiposPresentes[3] === "Operador de Comparacion" &&
            esElemento(tokens[4], elementosMientras) &&
            tiposPresentes[5] === "Parentesis de Cierre" &&
            tiposPresentes[6] === "Llaves de Apertura" &&
            tiposPresentes[7] === "Llaves de Cierre"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        }






        // Verificar si es una función TamañoDe 'TamañoDe(variable);'
        if (
            tiposPresentes.length === 5 &&
            tiposPresentes[0] === "Palabra Reservada - Funcion TamañoDe" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Identificador" &&  // Variable entre paréntesis
            tiposPresentes[3] === "Parentesis de Cierre" &&
            tiposPresentes[4] === "Delimitador"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        } else {
            const erroresTamañoDe = verificarElementosFaltantes(tiposPresentes, tokens);
            if (erroresTamañoDe.length > 0) {
                erroresTamañoDe.forEach(error => {
                    divErrores.innerHTML += `<p>Error en la línea ${linea}: ${error}</p>`;
                    hayError = true;
                });
                return;
            }
        }

        // Verificar si es una declaración de variable tipo 'var nombre = nombreDe MiSimbolo;'
        if (
            tiposPresentes.length === 6 &&
            tokens[0].valor === "var" && // La primera palabra debe ser 'var'
            tiposPresentes[1] === "Identificador" && // El segundo debe ser un identificador
            tiposPresentes[2] === "Operador de Asignacion" && // Tercero debe ser el operador '='
            tokens[3].valor === "nombreDe" && // La palabra reservada debe ser 'nombreDe'
            tiposPresentes[4] === "Identificador" && // El siguiente debe ser otro identificador
            tiposPresentes[5] === "Delimitador" // Debe terminar con un ';'
        ) {
            return; // Es válido, no es necesario marcarlo como error
        } else {
            const erroresVariable = verificarElementosFaltantes(tiposPresentes, tokens);
            if (erroresVariable.length > 0) {
                erroresVariable.forEach(error => {
                    divErrores.innerHTML += `<p>Error en la línea ${linea}: ${error}</p>`;
                    hayError = true;
                });
                return;
            }
        }

        // Verificar si es una declaración de evento tipo 'event MiDelegado MiEvento;'
        if (
            tiposPresentes.length === 4 &&
            tokens[0].valor === "event" && // La primera palabra debe ser 'event'
            tiposPresentes[1] === "Identificador" && // El segundo debe ser un identificador (tipo de delegado)
            tiposPresentes[2] === "Identificador" && // El tercero debe ser un identificador (nombre del evento)
            tiposPresentes[3] === "Delimitador" // Debe terminar con un ';'
        ) {
            return; // Es válido, no es necesario marcarlo como error
        } else {
            const erroresEvento = verificarElementosFaltantes(tiposPresentes, tokens);
            if (erroresEvento.length > 0) {
                erroresEvento.forEach(error => {
                    divErrores.innerHTML += `<p>Error en la línea ${linea}: ${error}</p>`;
                    hayError = true;
                });
                return;
            }
        }


        //_________________________________________________________________________________________
        /*
        // Verificar la declaración de uso 'usando'
        if (
            tiposPresentes.length === 3 &&
            tokens[0].valor === "usando" && // La primera palabra debe ser 'usando'
            tiposPresentes[1] === "Identificador" && // El segundo debe ser un identificador (el recurso)
            tiposPresentes[2] === "Delimitador" // Debe terminar con un ';'
        ) {
            return; // Es válido, no es necesario marcarlo como error
        } else {
            divErrores.innerHTML += `<p>Error en la línea ${linea}: Estructura incorrecta para 'usando'</p>`;
            hayError = true;
        }

*/

        // Verificar si es una declaración 'usando'
        if (
            tiposPresentes.length >= 3 && // Se permite al menos tres elementos
            tokens[0].valor === "usando" && // La primera palabra debe ser 'usando'
            tiposPresentes[1] === "Identificador" && // El segundo debe ser un identificador (el recurso)
            tokens[tokens.length - 1].valor === ";" // El último elemento debe ser un ';'
        ) {
            // Verificar que el identificador puede tener puntos (.) en el nombre
            const identificador = tokens.slice(1, -1).map(token => token.valor).join('');
            const identificadorValido = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)*$/.test(identificador);

            if (identificadorValido) {
                return; // Es válido, no es necesario marcarlo como error
            } else {
                divErrores.innerHTML += `<p>Error en la línea ${linea}: Identificador inválido después de 'usando'</p>`;
                hayError = true;
            }
            return; // Salir si se encontró un error en 'usando'
        }


        // Verificar si es una llamada a método en el formato 'leertecla.consola();'
        if (
            tiposPresentes.length === 6 && // Asegúrate de que la longitud sea 6
            tiposPresentes[0] === "Palabra Reservada - LeerTecla" &&
            tiposPresentes[1] === "Punto" &&
            tiposPresentes[2] === "Palabra Reservada - Consola" &&
            tiposPresentes[3] === "Parentesis de Apertura" &&
            tiposPresentes[4] === "Parentesis de Cierre" &&
            tokens[5].valor === ";"
        ) {
            console.log("sintaxis correcta"); // Mensaje de sintaxis correcta
            return; // Es válido, no es necesario marcarlo como error
        } else {
            console.log("sintaxis incorrecta"); // Mensaje de sintaxis incorrecta
            // Aquí puedes agregar más lógica para manejar errores si es necesario
        }


        // Verificar si la línea es 'bloquear(variable){}'
        if (
            tiposPresentes.length >= 6 &&
            tiposPresentes[0] === "Palabra Reservada - Bloquear" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Identificador" &&
            tiposPresentes[3] === "Parentesis de Cierre" &&
            tiposPresentes[4] === "Llave de Apertura" &&
            tiposPresentes[5] === "Llave de Cierre"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        } else {
            // Verificar la estructura completa de 'bloquear(variable){}'
            if (
                tiposPresentes.length >= 6 &&
                tokens[0].valor === "bloquear" &&
                tiposPresentes[1] === "Parentesis de Apertura" &&
                tiposPresentes[2] === "Identificador" &&
                tiposPresentes[3] === "Parentesis de Cierre" &&
                tiposPresentes[4] === "Llave de Apertura" &&
                tiposPresentes[5] === "Llave de Cierre"
            ) {
                return; // Es válido, no es necesario marcarlo como error
            } else {
                divErrores.innerHTML += `<p>Error en la línea ${linea}: Estructura incorrecta para 'bloquear(variable){}'</p>`;
                hayError = true;
            }
        }


        //-----------------------------------------------------------------------------------------
        // Si la línea no coincide con ninguna de las gramáticas, marcar error
        const mensajeError = `<span style="color: red;">Error de Sintaxis Encontrado en la Línea: # ${linea}</span>`;
        divErrores.innerHTML += mensajeError + "<br>";
        hayError = true;
    });

    // Si no hay errores, mostrar que la sintaxis es correcta
    if (!hayError) {
        const mensajeExito = `<span style="color: lime;">Sintaxis correcta</span>`;
        divErrores.innerHTML = mensajeExito + "<br>";
    }
}

function esElemento(token, elementosPermitidos) {
    return elementosPermitidos.includes(token.tipo);
}

//----------------------FUNCIONES DE LOS BOTONES---------------------------------

//FUNCION PRINCIPAL
function analizar() {
    const texto = document.getElementById("input").value;
    const tokensPorLinea = analizarTexto(texto);
    mostrarTokens(tokensPorLinea.flat()); // Mostrar tokens como antes
    validarSintaxis(tokensPorLinea);
}

//FUNCION PARA LIMPIAR TODO
function limpiar() {
    document.getElementById("input").value = ""; //limpia la consola
    const tablaTokens = document.getElementById("tablaTokens").getElementsByTagName('tbody')[0];
    tablaTokens.innerHTML = ""; // Limpiar tabla
    const contenedorErrores = document.getElementById("erroresSintaxis");
    contenedorErrores.innerHTML = ""; // Limpiar la consola de salida
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
    var instruccion0 = '//hola soy un comentario';
    var instruccion00 = '\nequipo();';
    var tipoDato1 = '\nboleano var = 1;';
    var instruccion01 = '\nescribir.consola("hola mundo");';
    var instruccion02 = '\npara(entero i=0; i<5; i++){}';
    var instruccion03 = '\nmientras(variable<=10){}';
    var instruccion04 = '\ninterruptor(var){}';
    var instruccion05 = '\nintenta{}atrapar(Excepcion ex){}';
    var instruccion06 = '\nleer.consola();';
    var instruccion07 = '\narreglitoVar.tamanio();';
    var instruccion08 = '\narreglitoVar.copia(destino,longitud);';
    var instruccion09 = '\ntamanioDe(variable);';
    var instruccion10 = '\nnombreDe(variable);';
    var instruccion11 = '\npublico evento Accion var;';
    var instruccion12 = '\nbloquear(variable){}';
    var instruccion13 = '\nusando Sistema.ES;';
    var instruccion14 = '\nleerTecla.consola();';
    var instruccion15 = '\nmate.mayor(numero1, numero2);';
    var instruccion16 = '\ncadenita.formatoDe(0);';
    var instruccion17 = '\ncomprobado{}';
    var instruccion18 = '\nid es cadena;';
    var instruccion19 = '\ndevuelve var;';
    var instruccion20 = '\npublico estatico hueco Metodo(){}';

    var cadInst = instruccion0 + instruccion00 + tipoDato1 + instruccion01 + instruccion02 + instruccion03 + instruccion04 + instruccion05 + instruccion06 + instruccion07 + instruccion08 + instruccion09 + instruccion10 + instruccion11 + instruccion12 + instruccion13 + instruccion14 + instruccion15 + instruccion16 + instruccion17 + instruccion18 + instruccion19 + instruccion20;
    document.getElementById("input").value = cadInst;
}

//-------------------FUNCIONES EXTRA DE LA CONSOLA ---------------

// Sincronizacion de la linea de los numeros de linea en la consola.
document.getElementById('input').addEventListener('input', function () {
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
document.getElementById('input').addEventListener('scroll', function () {
    const textarea = this;
    const lineas = document.getElementById('lineas');
    lineas.scrollTop = textarea.scrollTop;
});

//--------------------- CAMBIO DE TEMA -----------------------
document.getElementById('tema').addEventListener('change', function () {
    const themeStylesheet = document.getElementById('themeStylesheet');
    const currentTheme = themeStylesheet.getAttribute('href');

    if (currentTheme === 'estiloClaro.css') {
        themeStylesheet.setAttribute('href', 'estiloOscuro.css');
    } else {
        themeStylesheet.setAttribute('href', 'estiloClaro.css');
    }
});
