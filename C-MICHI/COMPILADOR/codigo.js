// Diccionario de palabras reservadas y operadores
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
    "}": "Llaves de Cierre"
};

//-----------------------------ANALISIS LEXICO---------------------------------

function analizarTexto(texto) {
    const tokensPorLinea = [];
    const regex = /==|!=|<=|>=|&&|\|\||\+\+|--|["][^"]*["]|['][^']*[']|\/\/.*|\/\*[\s\S]*?\*\/|\d+\.\d+|\d+|[\w]+|[-+*/%=&|!<>]=?|[{}()[\],;:.@]/g;
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
    

    tokensPorLinea.forEach(lineaObj => {
        const { linea, tokens } = lineaObj;
        let tiposPresentes = tokens.map(token => token.tipo);

        // Verificar si es un comentario (una línea o múltiples líneas)
        if (tiposPresentes.length === 1 && (tiposPresentes[0] === "Comentario de una linea" || tiposPresentes[0] === "Comentario de múltiples lineas")) {
            return; // Es válido, no es necesario marcarlo como error
        }

        

        // GRAMATICA PARA Verificar si es una declaración de variable
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

        // GRAMATICA PARA Verificar si es la instrucción equipo();
        if (
            tiposPresentes.length === 4 &&
            tiposPresentes[0] === "Palabra Reservada - Equipo" &&
            tiposPresentes[1] === "Parentesis de Apertura" &&
            tiposPresentes[2] === "Parentesis de Cierre" &&
            tiposPresentes[3] === "Delimitador"
        ) {
            return; // Es válido, no es necesario marcarlo como error
        }

       //GRAMATICA PARA Verificar gramatica de MATH.MAX Y MATH.MIN

       const elementos_mathmin_mathmax = ["Palabra Reservada - Mayor","Palabra Reservada - Menor"];
       const variable_o_numero=["Identificador","Literal Numerico"];
        if(
        tiposPresentes.length === 9 &&
        tiposPresentes[0]==="Palabra Reservada - Mate"&&
        tiposPresentes[1]==="Conector"&&
        esElemento(tokens[2],elementos_mathmin_mathmax)&&
        tiposPresentes[3]==="Parentesis de Apertura"&&
        esElemento(tokens[4],variable_o_numero)&&
        tiposPresentes[5]==="Separador"&&
        esElemento(tokens[6],variable_o_numero)&&
        tiposPresentes[7]==="Parentesis de Cierre"&&
        tiposPresentes[8]==="Delimitador"
       )    {
        return;
       }


       //GRAMATICA PARA LEER.CONSOLA
       if(
        tiposPresentes.length===5&&
        tiposPresentes[0]==="Palabra Reservada - Leer"&&
        tiposPresentes[1]==="Conector"&&
        tiposPresentes[2]==="Palabra Reservada - Consola"&&
        tiposPresentes[3]==="Parentesis de Apertura"&&
        tiposPresentes[4]==="Parentesis de Cierre"&&
        tiposPresentes[5]==="Delimitador"
       ) { return;}


       
       //GRAMATICA PARA COMPROBADO Y NO COMPROBADO
       const elementos_comprobados_nocomprobados=["Palabra Reservada - Comprobado","Palabra Reservada - NoComprobar"]
       if(
        tiposPresentes.length===3 &&
        esElemento(tokens[0],elementos_comprobados_nocomprobados)&&
        tiposPresentes[1]==="Llaves de Apertura"&&
        tiposPresentes[2]==="Llaves de Cierre"
        ){return;}



    if(
        tiposPresentes.length===3&&
        tiposPresentes[0]==="Identificador"&&
        tiposPresentes[1]==="Palabra Reservada - ES"&&
        tiposPresentes[2]==="Tipos de Dato"

    ){return;}





        // GRAMATICA PARA Verificar otras gramáticas como "while", "if", etc.
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
        






       // Si la línea no coincide con ninguna de las gramáticas, marcar error
       const mensajeError = `<p style="color: red;">Error de Sintaxis Encontrado en la Línea: ${linea}</p>`;
       divErrores.innerHTML += mensajeError; // Usar innerHTML para permitir HTML y saltos de línea
       hayError = true;
   });

   // Si no hay errores, mostrar que la sintaxis es correcta
   if (!hayError) {
       const mensajeExito = `<p style="color: green;">Sintaxis correcta</p>`;
       divErrores.innerHTML = mensajeExito; // Usar innerHTML para permitir HTML
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
