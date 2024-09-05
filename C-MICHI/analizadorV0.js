syncScroll();

function analizar() {
    analizadorLex();
    analizadorSyn();
    syncScroll();
}

//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------+------------------------------------------


function syncScroll() {
    var textarea = document.getElementById('input');
    var lineNumbers = document.getElementById('lineas');
    
    // Ajustar la altura del div de enumeración para que coincida con la altura del textarea
    lineNumbers.style.height = textarea.clientHeight + 'px';
    
    var lines = textarea.value.split('\n'); // Dividir el contenido del textarea en líneas
    lineNumbers.innerHTML = ''; // Limpiar el contenido actual del div de líneas

    // Generar y agregar números de línea al div de líneas
    for (var i = 0; i < lines.length; i++) {
        var lineNum = i + 1;
        var lineDiv = document.createElement('div');
        lineDiv.textContent = lineNum;
        lineDiv.style.paddingRight = '10px'; // Añadir un poco de espacio entre el número y el texto
        lineNumbers.appendChild(lineDiv);
    }

    // Sincronizar el scroll del div de enumeración con el scroll del textarea
    lineNumbers.scrollTop = textarea.scrollTop;
}

// Escuchar el evento input del textarea para actualizar los números de línea y la altura del div de enumeración
var textarea = document.getElementById('input');
textarea.addEventListener('input', syncScroll);

// Escuchar el evento scroll del textarea para sincronizar el scroll del div de enumeración
textarea.addEventListener('scroll', function() {
    var lineNumbers = document.getElementById('lineas');
    lineNumbers.scrollTop = this.scrollTop;
});


//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------

// Definir arreglos para cada tipo de token
var palabrasReservadas = ["equipo", "nulo", "Mensaje", "Principal", "entero", "flotante", "boleano", "caracter", "cadena", "publico", "estatico", "privado", "vacio", "protegido", "nuevo", "tipo", "clase", "nombrentorno", "argumentos",
    "escribir", "consola",
    "si", "sino", "contrario",
    "para", "paracadauno",
    "mientras", "hacer",
    "interruptor", "caso", "romper", "xdefecto", "devuelve",
    "intentar", "atrapar", "lanzar", "Excepcion", "DivideEntreZeroExcepcion", "esnuloovacio", "argumentoExcepcion", "OverflowExcepcion", "ejecutar", "invoca",
    "es", "Metodo",
    "leer",
    "tamanio", "copia",
    "tamaniode",
    "nombrede",
    "evento",
    "bloquear",
    "usando",
    "leertecla",
    "Mate", "mayor", "menor",
    "formatode",
    "comprobado", "nocomprobar",
    "objeto", "estructura", "enumeracion",
    "bloquear",
    "remitente", "este", "tarea",
    "leerTecla",
    "Sistema"
];
var simbolosAgrupacion = ["(", ")", "{", "}", "[", "]"];
var simbolocomentario=["//"];
var delimitadores = [";", ",", "."];
var asignacion = [":", "="];
var operadorLogico = ["||", "&&", "!"];
var comparaciones = ["<", ">", "==", "!=", "<=", ">="];
var operacionesAritmeticas = ["+", "-", "*", "/", "%"];
var suma = ["+"];
var resta = ["-"];
var multiplicacion = ["*"];
var division = ["/"];
var modulo = ["%"];

var numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var numerosHexadecimales = ['a', 'b', 'c', 'd', 'e', 'f'];
var numeroConPuntoDecimal = ".";
var comillasDobles = '"';
var comillasSimples = "'";
var escape = "\\";

var letras = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var numerosYGuionBajo = "0123456789_";

// Expresiones regulares para cada tipo
var numeroRegex = new RegExp('^\\d+(\\.\\d+)?$');
var literalRegex = new RegExp('^' + comillasDobles + '([^' + escape + comillasDobles + ']|' + escape + escape + '|' + escape + comillasDobles + ')*' + comillasDobles + '$');
var literalSimplesRegex = new RegExp("^" + comillasSimples + "([^" + escape + comillasSimples + "]|" + escape + escape + "|" + escape + comillasSimples + ")*" + comillasSimples + "$");
//var identificadorRegex = new RegExp('^[A-Za-z_][A-Za-z0-9_]*$');
var identificadorRegex = new RegExp('^[A-Za-z_][A-Za-z0-9_]*([+\\-*/%][(][A-Za-z0-9_+\\-*/%()]+[)])?$');


//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------

function analizadorLex() {
    var input = document.getElementById("input").value.trim(); // Obtener el contenido del textarea y eliminar espacios en blanco al inicio y al final
    var output = document.getElementById("tablaTokens"); // Acceder a la tabla dentro del div output

    // Expresión regular para dividir el texto en tokens según los delimitadores especificados
  //var tokens = input.match(/("[^"]*"|'[^']*'|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+)?|<=|>=|==|!=|\S)/g);
    var tokens = input.match(/("[^"]*"|'[^']*'|\/\/.*|[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+(?:\.[0-9]+)?|<=|>=|==|!=|\S)/g);


    // Limpiar el contenido de la tabla
    output.innerHTML = "<tr><th>Token</th><th>Tipo</th></tr>";

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i].trim();
        var tipo = "";

        // Clasificar el token según las reglas especificadas
        if (palabrasReservadas.includes(token)) {
            tipo = "Palabra reservada";
        } else if (token.startsWith("//")) {
            tipo = "Comentario";  
        } else if (simbolosAgrupacion.includes(token)) {
            tipo = "Símbolo de agrupación";
        } else if (delimitadores.includes(token)) {
            tipo = "Delimitador";
        } else if (comparaciones.includes(token)) {
            tipo = "Operador de comparación";
        } else if (asignacion.includes(token)) { // Verificar si el token es un operador de asignación
            tipo = "Asignación";
        } else if (operadorLogico.includes(token)) {
            tipo = "Operador lógico";
        } else if (suma.includes(token)) {
            tipo = "Suma";
        } else if (resta.includes(token)) {
            tipo = "Resta";
        } else if (multiplicacion.includes(token)) {
            tipo = "Multiplicacion";
        } else if (division.includes(token)) {
            tipo = "Division";
        } else if (modulo.includes(token)) {
            tipo = "Modulo";
        } else if (numeroRegex.test(token)) {
            tipo = "Número";
        } else if (literalRegex.test(token) || literalSimplesRegex.test(token)) {
            tipo = "Literal";
        } else if (identificadorRegex.test(token)) {
            tipo = "Identificador";
        } else {
            tipo = "Desconocido";
        }
        // Agregar el token, tipo a la tabla HTML
        output.innerHTML += "<tr><td>" + token + "</td><td>" + tipo + "</td></tr>";
    }
}

//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------


function analizadorSyn() {
    var input = document.getElementById("input").value.trim(); 

    var exp = '("[^"]*"|[a-zA-Z_][a-zA-Z_0-9]*)';
    var idonum = '(-*[0-9][0-9]*|[a-zA-Z_][a-zA-Z_0-9]*)';
    var comentario = '(//[^"]*)';
    var comaSeparador = ',\\s*';
    var puntoSeparador = '.\\s*';
    var operacionAritmetica = '(\\s*\\+\\s*|\\s*\\-\\s*|\\s*\\*\\s*|\\s*\\/\\s*)';
    var comparacion = '(<|>|==|!=|<=|>=)';
    var binario = '(0|1)';
    var num = '-*[0-9][0-9]*';
    var numDec = '-*[0-9]+(?:\\.[0-9]+)?';
    var lit = '("[^"]*")';
    var id = '[a-zA-Z_][a-zA-Z_0-9]*';
    var idnumlit = '(-*[0-9][0-9]*|-*[0-9]+(?:\\.[0-9]+)?|[a-zA-Z_][a-zA-Z_0-9]*|("[^"]*"))';
    var mm = '(mayor|menor)';
    var excepciones = '(Excepcion)'//agregar mas
    var usando1 = '(Sistema|Mate)';
    var usandolib = '(IO|Collections|Generic|Linq)';
    var modAccesso = '(publico|protegido|privado)';
    var tipoDato = '(entero|flotante|boleano|cadena)';
    //mover las reservadas Evento a las palabras reservadas de arriba
    var reservadasEvento = '(EventHandler|Func|AsyncCallback|ThreadStart|Comparison|MethodInovker|Action|Predicate|Converter)';
    var increDecre = '(\\+\\+|\\-\\-)';
    var igual = '\\=';


    var instrucciones = [
    /*--*/   ['\\s*',comentario], 
    //   [id, '\\s*\\=\\s*', '(?:', idonum, '(?:', operacionAritmetica, idonum, ')*', '|', '\\(', idonum, '(?:', operacionAritmetica, idonum, ')*', '\\)', '(?:', operacionAritmetica, idonum, ')*', '|', '\\(', idonum, , '|', '\\(', idonum, '(?:', operacionAritmetica, idonum, ')*', '\\)', '(?:', operacionAritmetica, idonum, , '|', '\\(', idonum, '(?:', operacionAritmetica, idonum, ')*', '\\)',')*', '\\)', ')', '\\;', '(?:','\\s*',comentario,')*'],
    /*--*/   [id, '\\s*\\=\\s*', '(?:', idonum, '(?:', operacionAritmetica, idonum, ')*',      '|',      '\\(', idonum, '(?:', operacionAritmetica, idonum, ')*', '\\)', ')',                                       '(?:', operacionAritmetica, '(?:', idonum, '(?:', operacionAritmetica, idonum, ')*', ')*'             ,'|',        '(?:', operacionAritmetica,  '\\(', idonum, '(?:', operacionAritmetica, idonum, ')*', '\\)', ')*',     ')*',                                        '\\;', '(?:','\\s*',comentario,')*'],
    /*--*/   ['boleano\\s+', id, '\\s*', '=', '\\s*', binario, '\\s*\\;','(?:','\\s*',comentario,')*'], 
    /*--*/   ['entero\\s+', id, '\\s*', '=', '\\s*', num, '\\s*\\;','(?:','\\s*',comentario,')*'],
    /*--*/   ['flotante\\s+', id, '\\s*', '=', '\\s*', numDec, '\\s*\\;','(?:','\\s*',comentario,')*'],
    /*--*/   ['cadena\\s+', id, '\\s*', '=', '\\s*', lit, '\\s*\\;','(?:','\\s*',comentario,')*'],
    /*00*/   ['equipo\\(\\);','(?:','\\s*',comentario,')*'],
    /*01*/   ['escribir\\.consola\\(', exp, '(?:', comaSeparador, exp, ')*', '\\);','(?:','\\s*',comentario,')*'], 
    /*02*/   ['para\\(entero', '\\s+', id, '\\s*', igual, '\\s*', idonum, '\\;', '\\s*', id, '\\s*', comparacion, '\\s*', idonum, '\\;', '\\s*', id, increDecre, '\\)\\{','\\}','(?:','\\s*',comentario,')*'],
    /*03*/   ['mientras\\(', idonum, comparacion, idonum, '\\)\\{','\\}','(?:','\\s*',comentario,')*'],
    /*04*/   ['interruptor\\(', id, '\\)\\{','\\s*','case','\\s+',idnumlit,'\\:', '(?:', 'romper\\;', ')*','(?:','\\s+','case','\\s+',idnumlit,'\\:','(?:', 'romper\\;', ')*',')*', '\\}','(?:','\\s*',comentario,')*'],
    /*05*/   ['intenta','\\{','\\}','atrapar\\(', excepciones, '\\s+', idonum, '\\)\\{','\\}','(?:', 'atrapar\\(', excepciones, '\\s+', idonum, '\\)\\{','\\}', ')*','(?:','\\s*',comentario,')*'],
    /*06*/   ['leer\\.consola\\(\\);','(?:','\\s*',comentario,')*'],
    /*07*/   [id,'.tamanio\\(\\);','(?:','\\s*',comentario,')*'],
    /*08*/   [id,'.copia\\(',id,comaSeparador,id,'\\);','(?:','\\s*',comentario,')*'],
    /*09*/   ['tamanioDe\\(', id,'\\);','(?:','\\s*',comentario,')*'],
    /*10*/   ['nombreDe\\(', id,'\\);','(?:','\\s*',comentario,')*'],
    /*11*/   [modAccesso,'\\s+','evento','\\s+', reservadasEvento, '\\s+', id, '\\;','(?:','\\s*',comentario,')*'],
    /*12*/   ['bloquear\\(', id,'\\)', ,'\\{','\\}','(?:','\\s*',comentario,')*'],
    /*13*/   ['usando','\\s+',usando1, '(?:',puntoSeparador,  usandolib, ')*', '\\;','(?:','\\s*',comentario,')*'],//aqui faltaria agregar mas
    /*14*/   ['leerTecla\\.consola\\(\\);','(?:','\\s*',comentario,')*'],
    /*15*/   ['mate',puntoSeparador,mm,'\\(', idonum, '\\s*', comaSeparador, '\\s*', idonum,'\\);','(?:','\\s*',comentario,')*'],
    /*16*/   [id, '\\.formatoDe\\(', binario, '\\);','(?:','\\s*',comentario,')*'],
    /*17*/   ['comprobado','\\{','\\}'],['noComprobado', '\\{','\\}','(?:','\\s*',comentario,')*'],
    /*18*/   [id,'\\s+','es','\\s+', id,'\\;','(?:','\\s*',comentario,')*'],
    /*19*/   ['retorna ','\\s*', id,'\\;','(?:','\\s*',comentario,')*'],
    /*20*/   [modAccesso,'(?:','\\s+','estatico',')*','(?:','\\s+','vacio',')*','\\s+',id,'\\(','(?:',tipoDato, '\\s+', id, '\\s*', '(?:',comaSeparador, '\\s*', tipoDato,'\\s+',id, ')*', ')*', '\\)','\\{','\\}','(?:','\\s*',comentario,')*']
    ];

    //-------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------------------------------------------
    var errorEnLinea = null;
    var lineas = input.split('\n'); 

    for (var i = 0; i < lineas.length; i++) {
        var instruccion = lineas[i].trim();
        if (instruccion === "") {
            continue;
        }

        var errorEnLineaActual = true; 
        for (var j = 0; j < instrucciones.length; j++) {
            var instruccionParts = instrucciones[j];
            var validSyntax = instruccionParts.join('');
            var isValidSyntax = new RegExp('^' + validSyntax + '$').test(instruccion);
            
            if (isValidSyntax) {
                errorEnLineaActual = false;
                break;
            }
        }

        if (errorEnLineaActual) {
            errorEnLinea = i + 1;
            break;
        }
    }

    if (errorEnLinea !== null) {
        var estadoDiv = document.getElementById("estado");
        estadoDiv.innerHTML = "<div id='estado' class='incorrecto'>Error en la línea: " + errorEnLinea + "</div>";
    } else {
        var estadoDiv = document.getElementById("estado");
        estadoDiv.innerHTML = "<div id='estado' class='correcto'>Sintaxis Correcta!!!</div>";
    }
}





//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------

function limpiar() {
    document.getElementById("input").value = "";
    var output = document.getElementById("tablaTokens");
    output.innerHTML = "<thead><tr><th>Token</th><th>Tipo</th></tr></thead><tbody></tbody>"; // Limpiar tanto el encabezado como el cuerpo de la tabla
    var estadoDiv = document.getElementById("estado");
    estadoDiv.innerHTML = ""; // Limpiar el estado
}

function salir() {
    window.close();
}

function equipo() {
    var cadInst = '// ♥♥♥INTEGRANTES DEL EQUIPO BRAVO♥♥♥\n// - Balleza Cortez Yahir Fernando\n// - Baltazar Cavazos Tania Daniela\n// - Castro Martinez Jose Angel \n// - Lerma Garcia Carlos Alberto\n// - Rocha Martinez Ricardo Javier\n// - Vega Lopez Citlali Nohemi';
    document.getElementById("input").value = cadInst;
    analizar();
}

function ingresarInstruccion() {
    var instruccion0 = '//hola soy un comentario';
    var instruccion00 = '\n\nequipo();';
    var tipoDato1 = '\n\nboleano var = 1;';

    var instruccion01 = '\n\nescribir.consola("hola mundo");';
    var instruccion02 = '\n\npara(entero i=0; i<5; i++){}';
    var instruccion03 = '\n\nmientras(variable<=10){}';
    var instruccion04 = '\n\ninterruptor(var){case 5: case var:}';
    var instruccion05 = '\n\nintenta{}atrapar(Excepcion ex){}';
    var instruccion06 = '\n\nleer.consola();';
    var instruccion07 = '\n\narreglitoVar.tamanio();';
    var instruccion08 = '\n\narreglitoVar.copia(destino,longitud);';
    var instruccion09 = '\n\ntamanioDe(variable);';
    var instruccion10 = '\n\nnombreDe(variable);';
    var instruccion11 = '\n\npublico evento Action var;';
    var instruccion12 = '\n\nbloquear(variable){}';
    var instruccion13 = '\n\nusando Sistema.IO;';
    var instruccion14 = '\n\nleerTecla.consola();';
    var instruccion15 = '\n\nmate.mayor(numero1, numero2);';
    var instruccion16 = '\n\ncadena.formatoDe(0);';
    var instruccion17 = '\n\ncomprobado{}';
    var instruccion18 = '\n\nid es string;';
    var instruccion19 = '\n\nretorna var;';
    var instruccion20 = '\n\npublico estatico vacio Metodo(){}';
    var cadInst = instruccion0 + instruccion00 + tipoDato1 + instruccion01 + instruccion02 + instruccion03 + instruccion04 + instruccion05 + instruccion06 + instruccion07 + instruccion08 + instruccion09 + instruccion10 + instruccion11 + instruccion12 + instruccion13 + instruccion14 + instruccion15 + instruccion16 + instruccion17 + instruccion18 + instruccion19 + instruccion20;
    document.getElementById("input").value = cadInst;
    analizar();
}

/* ------------------------------------------- */

function modo() {
    const stylesheet = document.getElementById('stylesheet');
    const boton = document.getElementById('modoOscuroBtn');
    
    // Obtener la ruta completa de la hoja de estilo actual
    const estiloActual = stylesheet.getAttribute('href');

    // Verificar qué estilo está actualmente activo
    if (estiloActual.endsWith('estilo1.css')) {
        // Cambiar al modo oscuro
        stylesheet.href = 'estilo2.css';
    } else {
        // Cambiar al modo claro
        stylesheet.href = 'estilo1.css';
    }
}
