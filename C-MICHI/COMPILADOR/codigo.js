//FUNCION PRINCIPAL
function analizar() {
    const texto = document.getElementById("input").value;
    const tokensPorLinea = analizarTexto(texto);
    
    // Obtener la tabla y limpiar las filas existentes
    const tablaSintactico = document.getElementById('tablaSintactico').getElementsByTagName('tbody')[0];
    tablaSintactico.innerHTML = "";  // Esto limpiará las filas de la tabla

    mostrarTokens(tokensPorLinea.flat()); // Mostrar tokens como antes
    validarSintaxis(tokensPorLinea);
    MostrarSemantica(texto);
}

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
    "escribirConsola": "Palabra Reservada - Escribir",
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
                else if (/^".*"$/.test(palabra) || /^'.*'$/.test(palabra)) tokenTipo = "Literal de Cadena";
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
        // Verificar si es la instrucción equipo();
        if (
            //tiposPresentes.length === 4 &&
            (tiposPresentes[0] === "Palabra Reservada - Equipo" || tiposPresentes[0] === null) && //validar incluso cuando no existe la palabra equipo
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Parentesis de Cierre" &&
            tiposPresentes[3] === "Delimitador"
        ) { return; }

        

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
 
         
         
         // Verificar si es un comentario (una línea o múltiples líneas)
         if (
             //tiposPresentes.length === 1 && 
             tiposPresentes[0] === "Comentario de una linea" || tiposPresentes[0] === "Comentario de múltiples lineas"
         ) {return; }
 
         
         
         // INSTRUCCIÓN #1 - escribirConsola
         const separadoresEscribir = ["Separador"];
         const elementosEscribir = ["Identificador", "Literal de Cadena"];
         if (
             tiposPresentes[0] === "Palabra Reservada - Escribir" &&
             tiposPresentes[1] === "Parentesis de Apertura" &&
            (tiposPresentes[2] === "Literal de Cadena" || tiposPresentes[2] === "Identificador") &&
             elementoOpcional(tiposPresentes.slice(3, tokens.length - 2), separadoresEscribir, elementosEscribir,0) &&
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
         ) { 
             return;
         }
 
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
            (tiposPresentes[2] === "Identificador" || tiposPresentes[2] === "Literal Numerico") && 
            // Verificamos el elemento opcional (comparador y valor)
            elementoOpcional(tiposPresentes.slice(3, tokens.length - 6), Comparador, Comparaciones, 1) &&
            // Verificamos los tres últimos tokens
            tiposPresentes[tokens.length - 6] === "Parentesis de Cierre" && 
            tiposPresentes[tokens.length - 5] === "Llaves de Apertura" &&
            tiposPresentes[tokens.length - 4] === "Llaves de Cierre" &&

            tiposPresentes[tokens.length - 3] === "Palabra Reservada - Contrario" && 
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
             (tiposPresentes[6] === "Literal Numerico" || tiposPresentes[6] === "Literal de Cadena" || tiposPresentes[6] === "Identificador") && 
             tiposPresentes[7] === "Asignacion de Bloque de Codigo" && 
             // Validamos los casos opcionales y el posible xDefecto
             elementoOpcionalDefault(tiposPresentes.slice(8, tokens.length - 1), elementosCasos, elementosValor, elementosAsignacion, 0) && 
             
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
           (tiposPresentes[1]=== "Palabra Reservada - Estatico") &&
           (tiposPresentes[2]=== "Palabra Reservada - Vacio" || tiposPresentes[2] === "Tipo de Dato") &&
            tiposPresentes[3] === "Identificador" && 
            tiposPresentes[4] === "Parentesis de Apertura" && 
            elementoMetodo(tiposPresentes.slice(5, tokens.length - 3), separadores, tipoDatoM, varNombre, 0) &&
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
             tiposPresentes[0] === "Identificador" &&
             tiposPresentes[1] === "Palabra Reservada - ES"&&
             tiposPresentes[2] === "Tipo de Dato" &&
             tiposPresentes[3] === "Delimitador"
         ){return;}
 
 


       

        //---------------------------------------------------------------------------------------------------------------------
        // Si la línea no coincide con ninguna de las gramáticas, marcar error
        if (!aceptarSemanticaPorLinea[index]) {
            const mensajeError = `<span style="color: red;">Error de Sintaxis en la Línea: # ${linea}</span>`;
            divErrores.innerHTML += mensajeError + "<br>";
            hayError = true;
        }
    });

    // Si no hay errores, mostrar que la sintaxis es correcta
    if (!hayError) {
        const mensajeExito = `<span style="color: #32CD32; font-weight: bold;">Sintaxis correcta</span>`;
        divErrores.innerHTML = mensajeExito + "<br>";
    }
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



function elementoMetodo(tokens, permitidosSeparador, permitidosElementos1, permitidosElementos2,vecesPermitidas) {
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
        if (!permitidosSeparador.includes(tokens[i])) {
            return false; // El separador no es válido
        }

        // Verificamos que el siguiente token sea un identificador o un literal (depende del contexto)
        if (!permitidosElementos1.includes(tokens[i + 1])) {
            return false; // El elemento no es válido
        }

        // Verificamos que el siguiente token sea un identificador o un literal (depende del contexto)
        if (!permitidosElementos2.includes(tokens[i + 2])) {
            return false; // El elemento no es válido
        }

        vecesUsadas++;// Incrementamos las veces usadas por cada par de tokens (separador + elemento)
    }

    return true; // Todos los elementos opcionales son válidos dentro del límite
}



function elementoOpcionalDefault(tokens, permitidosCasos, permitidosValores, permitidosAsignacion, vecesPermitidas) {
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
                !permitidosValores.includes(tokens[i + 1]) || 
                !permitidosAsignacion.includes(tokens[i + 2])) {
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
    if(aceptarSemanticaPorLinea[index] == true){
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
    var instruccion0 = '//hola soy un comentario';
    var instruccion00 = '\nequipo();';
    var tipoDato1 = '\nboleano var = 1;';
    var instruccion01 = '\nescribirConsola("hola mundo");';
    var instruccion02 = '\npara(entero i=0; i<5; i++){}';
    var instruccion03 = '\nmientras(variable<=10){}';
    var instruccion04 = '\ninterruptor(var){caso 1: caso 2: xDefecto:}';
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
    var instruccion16 = '\nid ES entero;';
    var instruccion17 = '\ncomprobado{}';
    var instruccion18 = '\nsi(5>id){}contrario{}';
    var instruccion19 = '\npublico estatico vacio ola(){}';
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


function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(`tab-${tabId}`).style.display = 'block';
}