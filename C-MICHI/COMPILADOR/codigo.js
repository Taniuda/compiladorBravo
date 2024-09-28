// Diccionario de palabras reservadas y operadores
const palabrasReservadas = {
    "equipo": "Palabra Reservada - Equipo",
    "nulo": "Palabra Reservada - Nulo",
    "Mensaje": "Palabra Reservada - Mensaje",
    "Principal": "Palabra Reservada - Principal",
    "entero": "Tipo de Dato",
    "flotante": "Tipo de Dato",
    "boleano": "Tipo de Dato",
    "caracter": "Tipo de Dato",
    "cadena": "Tipo de Dato",
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
    "mayus": "Palabra Reservada - MAYUS",
    "minus": "Palabra Reservada - MINUS",
    "comprobado": "Palabra Reservada - Comprobado",
    "noComprobar": "Palabra Reservada - NoComprobar",
    "objeto": "Palabra Reservada - Objeto",
    "estructura": "Palabra Reservada - Estructura",
    "enumeracion": "Palabra Reservada - Enumeracion",
    "remitente": "Palabra Reservada - Remitente",
    "este": "Palabra Reservada - Este",
    "tarea": "Palabra Reservada - Tarea",
    "Sistema": "Palabra Reservada - Sistema",
    "ES": "Palabra Reservada - ES"
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
    "AND": "Operador Logico",
    "OR": "Operador Logico",
    "NOT": "Operador Logico",
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
    "}": "Llaves de Cierre"
};

//-----------------------------ANALISIS LEXICO---------------------------------

function analizarTexto(texto) {
    const tokensPorLinea = [];
    const regex = /==|!=|<=|>=|&&|\|\||\+\+|--|["][^"]*["]|['][^']*[']|["]|[']|\/\/.*|\/\*[\s\S]*?\*\/|\d+\.\d+|\d+|[\w]+|[-+*/%=&|!<>]=?|[{}()[\],;:.@]/g;
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
                // Detectar literales de cadena correctamente
                else if (/^".*"$/.test(palabra) || /^'.*'$/.test(palabra)) tokenTipo = "Literal de Cadena";
                // Detectar comillas sueltas como símbolos desconocidos
                else if (/^["]$/.test(palabra) || /^['']$/.test(palabra)) tokenTipo = "Simbolo Desconocido";
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

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// --------------------ANALISIS SINTACTICO (GRAMATICO )-----------------------


function validarSintaxis(tokensPorLinea) {
    const divErrores = document.getElementById("erroresSintaxis");
    divErrores.innerHTML = ""; // Limpiar el contenido previo
    let hayError = false;

    tokensPorLinea.forEach(lineaObj => {
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
            generarArbolBinario(tokensPorLinea);
            return;
        }
        
        // Verificar si es un comentario (una línea o múltiples líneas)
        if (
            //tiposPresentes.length === 1 && 
            tiposPresentes[0] === "Comentario de una linea" || tiposPresentes[0] === "Comentario de múltiples lineas"
        ) {return; }

        // Verificar si es la instrucción equipo();
        if (
            //tiposPresentes.length === 4 &&
            tiposPresentes[0] === "Palabra Reservada - Equipo" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Parentesis de Cierre" &&
            tiposPresentes[3] === "Delimitador"
        ) { return; }
    
        //----------------------------------------------------------

        // INSTRUCCIÓN #1 - escribir.consola
        const separadoresEscribir = ["Separador"];
        const elementosEscribir = ["Identificador", "Literal de Cadena"];
        if (
            tiposPresentes[0] === "Palabra Reservada - Escribir" &&
            tiposPresentes[1] === "Conector" &&
            tiposPresentes[2] === "Palabra Reservada - Consola" &&
            tiposPresentes[3] === "Parentesis de Apertura" &&
           (tiposPresentes[4] === "Literal de Cadena" || tiposPresentes[4] === "Identificador") &&
            elementoOpcional(tiposPresentes.slice(5, tokens.length - 2), separadoresEscribir, elementosEscribir,0) &&
            tiposPresentes[tokens.length - 2] === "Parentesis de Cierre" &&//penultimo
            tiposPresentes[tokens.length - 1] === "Delimitador"//ultimo elemento
        ) { return; }

        //INSTRUCCION #2 - leer.consola
        if(
            //tiposPresentes.length===5&&
            tiposPresentes[0]==="Palabra Reservada - Leer"&&
            tiposPresentes[1]==="Conector"&&
            tiposPresentes[2]==="Palabra Reservada - Consola"&&
            tiposPresentes[3]==="Parentesis de Apertura"&&
            tiposPresentes[4]==="Parentesis de Cierre"&&
            tiposPresentes[5]==="Delimitador"
        ) { return;}

        //INSTRUCCION #3 - leerTecla.consola
        if(
            //tiposPresentes.length===5&&
            tiposPresentes[0]==="Palabra Reservada - LeerTecla"&&
            tiposPresentes[1]==="Conector"&&
            tiposPresentes[2]==="Palabra Reservada - Consola"&&
            tiposPresentes[3]==="Parentesis de Apertura"&&
            tiposPresentes[4]==="Parentesis de Cierre"&&
            tiposPresentes[5]==="Delimitador"
        ) { return;}

        // INSTRUCCION #4 -  para
        if (
            tiposPresentes.length === 16 &&
            tiposPresentes[0] === "Palabra Reservada - Para" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 

            tiposPresentes[2] === "Tipo de Dato" && 
            tiposPresentes[3] === "Identificador" && 
            tiposPresentes[4] === "Operador de Asignacion" && 
            (tiposPresentes[5] === "Literal Numerico" || tiposPresentes[5] === "Identificador") &&
            tiposPresentes[6] === "Delimitador" &&

            tiposPresentes[7] === "Identificador" && 
            tiposPresentes[8] === "Operador de Comparacion" && 
            (tiposPresentes[9] === "Literal Numerico" || tiposPresentes[9] === "Identificador") &&
            tiposPresentes[10] === "Delimitador" && 

            tiposPresentes[11] === "Identificador" &&
            tiposPresentes[12] === "Operador de Incremento/Decremento" && 

            tiposPresentes[13] === "Parentesis de Cierre" && 
            tiposPresentes[14] === "Llaves de Apertura" && 
            tiposPresentes[15] === "Llaves de Cierre"
        ) { return;}

        // INSTRUCCION #5 - mientras
        const elementosNumID = ["Identificador", "Literal Numerico"];
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - Mientras" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            tiposPresentes[3] === "Operador de Comparacion" && 
            (tiposPresentes[4] === "Literal Numerico" || tiposPresentes[4] === "Identificador") &&
            tiposPresentes[5] === "Parentesis de Cierre" && 
            tiposPresentes[6] === "Llaves de Apertura" && 
            tiposPresentes[7] === "Llaves de Cierre"
        ) {return;}

        // INSTRUCCION #6 - SINO
        const elementoElseIf = ["Palabra Reservada - Sino"];
        const ParInicial = ["Parentesis de Apertura"];
        const Comparador = ["Operador de Comparacion"];
        const Id = ["Identificador"];
        const Comparaciones = ["Identificador", "Literal Numerico", "Literal de Cadena"];
        const ParFinal = ["Parentesis de Cierre"];

        if (
            tiposPresentes[0] === "Palabra Reservada - Si" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            // Verificamos el elemento opcional (comparador y valor)
            elementoOpcional2(tiposPresentes.slice(3, tokens.length - 3), Comparador, Comparaciones, 1) &&
            // Verificamos los tres últimos tokens
            tiposPresentes[tokens.length - 3] === "Parentesis de Cierre" && 
            tiposPresentes[tokens.length - 2] === "Llaves de Apertura" &&
            tiposPresentes[tokens.length - 1] === "Llaves de Cierre"
        ) {
            return true; // Sintaxis correcta
        }

        // INSTRUCCION #7 - INTERRUPTOR 
        const elementosCasos = ["Palabra Reservada - Caso"];
        const elementosAsignacion = ["Asignacion de Bloque de Codigo"];
        const elementosValor = ["Identificador", "Literal Numerico", "Literal de Cadena"];
        const xdefectocaso=["Palabra Reservada - XDefecto"];
        if (
            tiposPresentes[0] === "Palabra Reservada - Interruptor" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            tiposPresentes[3] === "Parentesis de Cierre" && 
            tiposPresentes[4] === "Llaves de Apertura" && 
        
            // Verificamos el primer caso (caso:1, caso:2, etc.)
            tiposPresentes[5] === "Palabra Reservada - Caso" && 
            tiposPresentes[6] === "Asignacion de Bloque de Codigo" && 
            (tiposPresentes[7] === "Literal Numerico" || tiposPresentes[7] === "Literal de Cadena" || tiposPresentes[7] === "Identificador") && 
        
            // Validamos los casos opcionales y el posible xDefecto
            elementoOpcionalDefault(tiposPresentes.slice(8, tokens.length - 1), elementosCasos, elementosAsignacion, elementosValor, 0) && 
            
            // Verificamos que la estructura cierre correctamente con llaves de cierre
            tiposPresentes[tokens.length - 1] === "Llaves de Cierre"
        ) {
            return true; // Sintaxis correcta
        }

        // INSTRUCCION #8 - INTENTA ATRAPAR
        const elementosExcepciones = ["Palabra Reservada - Excepcion", "Palabra Reservada - DivideEntreZeroExcepcion"];
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - Intenta" && 
            tiposPresentes[1] === "Llaves de Apertura" && 
            tiposPresentes[2] === "Llaves de Cierre" && 
            tiposPresentes[3] === "Palabra Reservada - Atrapar" && 
            tiposPresentes[4] === "Parentesis de Apertura" && 
            (tiposPresentes[5] === "Palabra Reservada - Excepcion" || tiposPresentes[5] === "Palabra Reservada - DivideEntreZeroExcepcion") &&
            tiposPresentes[6] === "Identificador" &&
            tiposPresentes[7] === "Parentesis de Cierre" && 
            tiposPresentes[8] === "Llaves de Apertura" && 
            tiposPresentes[9] === "Llaves de Cierre"
        ) { return;}
        
        // INSTRUCCION #9 - arreglo.tamanio
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Identificador" && 
            tiposPresentes[1] === "Conector" && 
            tiposPresentes[2] === "Palabra Reservada - Tamanio" && 
            tiposPresentes[3] === "Delimitador"
        ) { return;}

        // INSTRUCCION #10 - arreglo.copia
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Identificador" && 
            tiposPresentes[1] === "Conector" && 
            tiposPresentes[2] === "Palabra Reservada - Copia" && 
            tiposPresentes[3] === "Parentesis de Apertura" && 
            tiposPresentes[4] === "Identificador" && 
            tiposPresentes[5] === "Separador" && 
            tiposPresentes[6] === "Identificador" && 
            tiposPresentes[7] === "Parentesis de Cierre" && 
            tiposPresentes[8] === "Delimitador"
        ) { return;}

        // INSTRUCCION #11 - tamanioDe
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - TamanioDe" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            tiposPresentes[3] === "Parentesis de Cierre" && 
            tiposPresentes[4] === "Delimitador"
        ) { return;}
        
        // INSTRUCCION #12 - nombreDe
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - NombreDe" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            tiposPresentes[3] === "Parentesis de Cierre" && 
            tiposPresentes[4] === "Delimitador"
        ) { return;}

        // INSTRUCCION #13 - formatoDe
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - FormatoDe" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
           (tiposPresentes[2] === "Palabra Reservada - MAYUS" || tiposPresentes[2] === "Palabra Reservada - MINUS") &&
            tiposPresentes[3] === "Parentesis de Cierre" && 
            tiposPresentes[4] === "Delimitador"
        ) { return;}

        // INSTRUCCION #14 - bloquear
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - Bloquear" && 
            tiposPresentes[1] === "Parentesis de Apertura" && 
            tiposPresentes[2] === "Identificador" && 
            tiposPresentes[3] === "Parentesis de Cierre" && 
            tiposPresentes[4] === "Llaves de Apertura" &&
            tiposPresentes[5] === "Llaves de Cierre" 
        ) { return;}

        // INSTRUCCION #15 - usando
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Palabra Reservada - Usando" && 
            tiposPresentes[1] === "Palabra Reservada - Sistema" && 
            tiposPresentes[2] === "Conector" &&
            tiposPresentes[3] === "Palabra Reservada - ES" && 
            tiposPresentes[4] === "Delimitador"
        ) { return;}
        

        //INSTRUCCION #16 - MATH.MAX Y MATH.MIN
        if(
            //tiposPresentes.length === 9 &&
            tiposPresentes[0]=== "Palabra Reservada - Mate"&&
            tiposPresentes[1]=== "Conector"&&
           (tiposPresentes[2]=== "Palabra Reservada - Mayor" || tiposPresentes[2] === "Palabra Reservada - Menor") &&
            tiposPresentes[3]=== "Parentesis de Apertura"&&
           (tiposPresentes[4]=== "Literal Numerico" || tiposPresentes[4] === "Identificador") &&
            tiposPresentes[5]=== "Separador"&&
           (tiposPresentes[6]=== "Literal Numerico" || tiposPresentes[6] === "Identificador") &&
            tiposPresentes[7]=== "Parentesis de Cierre"&&
            tiposPresentes[8]=== "Delimitador"
        ) {return;}

        //INSTRUCCION #17 - COMPROBADO Y NO COMPROBADO
        if(
            //tiposPresentes.length===3 &&
           (tiposPresentes[0]=== "Palabra Reservada - Comprobado" || tiposPresentes[0] === "Palabra Reservada - NoComprobar") &&
            tiposPresentes[1]==="Llaves de Apertura"&&
            tiposPresentes[2]==="Llaves de Cierre"
        ){return;}


        // INSTRUCCION #18 -metodo
        const tipoDatoM = ["Tipo de Dato"];
        const varNombre = ["Identificador"];
        const separadores = ["Separador"];
        if (
            //tiposPresentes.length === 8 &&
            tiposPresentes[0] === "Modificadores de Acceso" && 
            tiposPresentes[1] === "Palabra Reservada - Estatico" && 
           (tiposPresentes[2]=== "Palabra Reservada - Vacio" || tiposPresentes[2] === "Tipo de Dato") &&
            tiposPresentes[3] === "Identificador" && 
            tiposPresentes[4] === "Parentesis de Apertura" && 
            elementoOpcional3(tiposPresentes.slice(5, tokens.length - 3), tipoDatoM, varNombre, separadores, 0) &&
            tiposPresentes[tokens.length - 3] === "Parentesis de Cierre" &&
            tiposPresentes[tokens.length - 2] === "Llaves de Apertura" &&//penultimo
            tiposPresentes[tokens.length - 1] === "Llaves de Cierre"
        ) { return;}

        // INSTRUCCION #19 - DECLARACION DE VARIABLE
        const operadorAsignacion=["Operador de Asignacion"];
        const tiposdevalor=["Literal Numerico","Literal de Cadena"];
        if (
            //tiposPresentes.length === 5 &&
            tiposPresentes[0] === "Tipo de Dato" &&
            tiposPresentes[1] === "Identificador" &&
            elementoOpcional(tiposPresentes.slice(2, tokens.length - 1), operadorAsignacion, tiposdevalor, 1) &&
            tiposPresentes[tokens.length - 1] === "Delimitador"//esto es para que siempre este en la ultima posicion
        ) {return;}

        //INSTRUCCION #20 - ES
        if(
            //tiposPresentes.length===3&&
            tiposPresentes[0]==="Identificador"&&
            tiposPresentes[1]==="Palabra Reservada - ES"&&
            tiposPresentes[2]==="Tipos de Dato"
        ){return;}

        









        //---------------------------------------------------------------------------------------------------------------------
        // Si la línea no coincide con ninguna de las gramáticas, marcar error
        const mensajeError = `<span style="color: red;">Error de Sintaxis en la Línea: # ${linea}</span>`;
        divErrores.innerHTML += mensajeError + "<br>";
        hayError = true;
    });

    // Si no hay errores, mostrar que la sintaxis es correcta
    if (!hayError) {
        const mensajeExito = `<span style="color: #32CD32; font-weight: bold;">Sintaxis correcta</span>`;

        divErrores.innerHTML = mensajeExito + "<br>";
    }
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

function elementoOpcional3(tokens, valor1, valor2, valor3, vecesPermitidas) {
    if (tokens.length === 0) return true; // No hay elementos opcionales, lo cual es válido.
    let limite = vecesPermitidas === 0 ? Infinity : vecesPermitidas; // Si vecesPermitidas es 0, no hay límite en cuántas veces podemos usar los tokens
    let vecesUsadas = 0; // Cada vez que se recorre un par (separador + elemento), cuenta como 1 vez permitida

    // Recorremos los tokens en pares de separador y elemento
    for (let i = 0; i < tokens.length; i += 3) {
        // Verificamos que no se excedan las veces permitidas
        if (vecesUsadas >= limite) {
            return false; // Se ha superado el número de veces permitidas
        }

        // Verificamos que haya un separador (ej. coma, operador aritmético)
        if (!valor1.includes(tokens[i])) {
            return false; // El separador no es válido
        }

        // Verificamos que el siguiente token sea un identificador o un literal (depende del contexto)
        if (!valor2.includes(tokens[i + 1])) {
            return false; // El elemento no es válido
        }

        if (!valor3.includes(tokens[i + 2])) {
            return false; // El elemento no es válido
        }

        vecesUsadas++;// Incrementamos las veces usadas por cada par de tokens (separador + elemento)
    }

    return true; // Todos los elementos opcionales son válidos dentro del límite
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


function elementoOpcionalDefault(tokens, permitidosCasos, permitidosAsignacion, permitidosValores, vecesPermitidas) {
    let vecesUsadas = 0;
    let tieneXDefecto = false; // Para verificar si ya se ha encontrado xDefecto

    for (let i = 0; i < tokens.length; ) {
        // Verificamos si encontramos un xDefecto
        if (tokens[i] === "Palabra Reservada - XDefecto") {
            if (tieneXDefecto) return false; // Si ya existe un xDefecto, no puede haber otro
            tieneXDefecto = true; // Marca que se ha encontrado xDefecto

            // xDefecto debe tener asignación (por ejemplo, xDefecto: )
            if (tokens[i + 1] !== "Asignacion de Bloque de Codigo") return false;

            // Si hay xDefecto, solo avanzamos 2 posiciones
            i += 2;
        } else {
            // Verificamos el caso
            if (!permitidosCasos.includes(tokens[i]) || 
                !permitidosAsignacion.includes(tokens[i + 1]) || 
                !permitidosValores.includes(tokens[i + 2])) {
                return false; // Si no es un caso válido, la sintaxis es incorrecta.
            }
            vecesUsadas++;
            // Avanzamos 3 posiciones para el siguiente caso
            i += 3;
        }
    }

    return true; // Si todos los casos y xDefecto son válidos
}

function elementoOpcionalElse(tokens, permitidosCasos, parI, id, permitidosAsignacion, permitidosValores, parF, vecesPermitidas) {
    let vecesUsadas = 0;
    let tieneElse = false; // Para verificar si ya se ha encontrado "Contrario"

    for (let i = 0; i < tokens.length; ) {
        // Verificamos si encontramos un "Contrario"
        if (tokens[i] === "Palabra Reservada - Contrario") {
            if (tieneElse) return false; // Si ya existe "Contrario", no puede haber otro
            tieneElse = true; // Marca que se ha encontrado "Contrario"

            // Verificamos que "Contrario" tenga llaves de apertura y cierre
            if (tokens[i + 1] !== "Llaves de Apertura") return false;
            if (tokens[i + 2] !== "Llaves de Cierre") return false;

            // Si hay "Contrario", avanzamos 3 posiciones
            i += 3;
        } else {
            // Verificamos los casos
            if (!permitidosCasos.includes(tokens[i]) || 
                !parI.includes(tokens[i + 1]) ||  // Verificamos el paréntesis de apertura
                !id.includes(tokens[i + 2]) ||   // Verificamos el identificador
                !permitidosAsignacion.includes(tokens[i + 3]) ||  // Verificamos la asignación
                !permitidosValores.includes(tokens[i + 4]) ||  // Verificamos el valor
                !parF.includes(tokens[i + 5])) {  // Verificamos el paréntesis de cierre
                return false; // Si no es un caso válido, la sintaxis es incorrecta.
            }
            vecesUsadas++;
            // Avanzamos 6 posiciones para el siguiente caso
            i += 6;
        }
    }

    return true; // Si todos los casos y "Contrario" son válidos
}








































// Definir las jerarquías de los operadores
const jerarquiaOperadores = {
    'OR': 1,
    'AND': 2,
    '<': 3,
    '>': 3,
    '<=': 3,
    '>=': 3,
    '==': 3,
    '!=': 3,
    'NOT':4,
    '=': 5,
    '+': 6,
    '-': 6,
    '*': 7,
    '/': 7,
};

// Función para encontrar el operador principal, ajustada para operadores de múltiples caracteres
function encontrarOperadorPrincipal(expr) {
    let nivelParentesis = 0;
    let operadorPrincipal = null;
    let posicionOperador = -1;
    let menorJerarquia = Infinity;

    // Iterar sobre la expresión de derecha a izquierda, pero ahora se buscan operadores de varias letras
    for (let i = expr.length - 1; i >= 0; i--) {
        const char = expr[i];

        if (char === ')') {
            nivelParentesis++;
        } else if (char === '(') {
            nivelParentesis--;
        }

        if (nivelParentesis === 0) {
            // Comprobar operadores de más de un carácter (como AND y OR)
            for (const operador in jerarquiaOperadores) {
                if (expr.slice(i - operador.length + 1, i + 1) === operador) {
                    const jerarquia = jerarquiaOperadores[operador];
                    if (jerarquia < menorJerarquia) {
                        menorJerarquia = jerarquia;
                        operadorPrincipal = operador;
                        posicionOperador = i - operador.length + 1; // Asegurarse de que la posición es el inicio del operador
                    }
                }
            }
        }
    }

    return { operador: operadorPrincipal, posicion: posicionOperador };
}

// Función recursiva para construir el árbol binario
function construirArbol(expr) {
    expr = expr.replace(/\s+/g, ''); // Remover espacios en blanco

    // Si es un número o identificador, devolver un nodo hoja
    if (!isNaN(expr) || /^[a-zA-Z_]\w*$/.test(expr)) {
        return { name: expr, children: [] };
    }

    // Caso especial: si la expresión tiene paréntesis, asegurarnos de desglosar lo que hay dentro
    if (expr[0] === '(' && expr[expr.length - 1] === ')') {
        return construirArbol(expr.slice(1, -1)); // Procesar el contenido entre los paréntesis
    }

    // Encontrar el operador principal
    const { operador, posicion } = encontrarOperadorPrincipal(expr);

    if (operador) {
        const izquierda = expr.slice(0, posicion);
        const derecha = expr.slice(posicion + operador.length);

        return {
            name: operador,
            children: [
                construirArbol(izquierda),
                construirArbol(derecha)
            ]
        };
    }

    // Si no hay operadores, devolver un nodo con la expresión
    return { name: expr, children: [] };
}

// Crear un conjunto para almacenar las expresiones procesadas
const expresionesProcesadas = new Set();

// Función para generar el árbol binario de una línea de código
function generarArbolBinario(tokensPorLinea) {
    // Eliminar la línea que borra los árboles previos:
    // document.getElementById('arbolesSintacticos').innerHTML = "";

    tokensPorLinea.forEach((lineaObj, index) => {
        const { tokens } = lineaObj;

        const identificador = tokens[0].valor; // Nombre de la variable
        const operador = tokens[1].valor; // Operador de asignación
        const expresion = tokens.slice(2).map(token => token.valor).join(""); // Expresión completa

        if (expresionesProcesadas.has(expresion)) {
            console.log(`La expresión "${expresion}" ya ha sido procesada.`);
            return; 
        }

        expresionesProcesadas.add(expresion);
        
        // Crear el árbol binario de la expresión
        const treeData = {
            name: operador,
            children: [
                { name: identificador, children: [] },
                construirArbol(expresion)
            ]
        };

        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td id="arbolCell_${expresionesProcesadas.size}"></td>`; // Usar el tamaño del set para un id único
        document.getElementById('arbolesSintacticos').appendChild(row);

        dibujarArbol(treeData, expresionesProcesadas.size);
    });
}

// Función para dibujar el árbol sintáctico en SVG
function dibujarArbol(treeData, index) {
    const svgWidth = 400, svgHeight = 300;

    const svg = d3.select(`#arbolCell_${index}`)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('id', 'arbol_' + index);

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree().size([svgWidth - 50, svgHeight - 60]);

    const nodes = treeLayout(root).descendants();
    const links = treeLayout(root).links();

    const g = svg.append('g').attr('transform', 'translate(20, 30)');

    g.selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .style('stroke', '#aaa');

    g.selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 10)
        .style('fill', 'cyan');

    g.selectAll('.label')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => d.x)
        .attr('y', d => d.y - 10)
        .attr('text-anchor', 'middle')
        .text(d => d.data.name)
        .style('fill', 'blue');
}











//----------------------FUNCIONES DE LOS BOTONES---------------------------------

//FUNCION PRINCIPAL
function analizar() {
    const texto = document.getElementById("input").value;
    const tokensPorLinea = analizarTexto(texto);
    mostrarTokens(tokensPorLinea.flat()); // Mostrar tokens como antes
    validarSintaxis(tokensPorLinea);
}

//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------




//FUNCION PARA LIMPIAR TODO
function limpiar() {
    document.getElementById("input").value = ""; //limpia la consola
    const tablaTokens = document.getElementById("tablaTokens").getElementsByTagName('tbody')[0];
    tablaTokens.innerHTML = ""; // Limpiar tabla
    const contenedorErrores = document.getElementById("erroresSintaxis");
    contenedorErrores.innerHTML = ""; // Limpiar la consola de salida
    const tablaSintactico = document.getElementById("tablaSintactico").getElementsByTagName('tbody')[0];
    tablaSintactico.innerHTML = ""; // Limpiar tabla de análisis sintáctico
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
    var instruccion04 = '\ninterruptor(var){caso: 1}';
    var instruccion05 = '\nintenta{}atrapar(Excepcion ex){}';
    var instruccion06 = '\nleer.consola();';
    var instruccion07 = '\narreglitoVar.tamanio;';
    var instruccion08 = '\narreglitoVar.copia(destino,longitud);';
    var instruccion09 = '\ntamanioDe(variable);';
    var instruccion10 = '\nnombreDe(variable);';
    var instruccion11 = '\nformatoDe(minus);';
    var instruccion12 = '\nbloquear(variable){}';
    var instruccion13 = '\nusando Sistema.ES;';
    var instruccion14 = '\nleerTecla.consola();';
    var instruccion15 = '\nmate.mayor(numero1, numero2);';
    var instruccion16 = '\nformatoDe(mayus);';
    var instruccion17 = '\ncomprobado{}';
    var instruccion18 = '\n';
    var instruccion19 = '\n';
    var instruccion20 = '\n';
    
    var cadInst = instruccion0 + instruccion00 + tipoDato1 + instruccion01 + instruccion02 + instruccion03 + instruccion04 + instruccion05 + instruccion06 + instruccion07 + instruccion08 + instruccion09 + instruccion10 + instruccion11 + instruccion12 + instruccion13 + instruccion14 + instruccion15 + instruccion16 + instruccion17 + instruccion18 + instruccion19 + instruccion20;
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
