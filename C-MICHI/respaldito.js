// Verifica la sintaxis en base a la gramática
function analizarSintaxis(tokens) {
    const errores = [];

    // Recorrer cada línea de tokens
    tokens.forEach(lineaTokens => {
        const tiposTokens = lineaTokens.map(token => token.tipo);
        let sintaxisCorrecta = false;

        // Comparar con todas las gramáticas definidas
        for (const [nombreGramatica, gramatica] of Object.entries(gramaticas)) {
            if (compararGramatica(tiposTokens, gramatica)) {
                sintaxisCorrecta = true;
                break;
            }
        }

        // Si ninguna gramática coincide, se considera un error de sintaxis
        if (!sintaxisCorrecta) {
            errores.push(`Error de sintaxis en la línea ${lineaTokens[0].linea}`);
        }
    });
    return errores.length === 0 ? "Sintaxis correcta" : errores.join('\n');
}

// Compara los tokens con una gramática específica
function compararGramatica(tiposTokens, gramatica) {
    if (gramatica.includes("CuerpoEscribir")) {
        const indexInicio = gramatica.indexOf("CuerpoEscribir");
        const antesCuerpo = gramatica.slice(0, indexInicio);
        const despuesCuerpo = gramatica.slice(indexInicio + 1);

        // Validar la parte antes del cuerpo
        if (!compararParte(tiposTokens.slice(0, antesCuerpo.length), antesCuerpo)) return false;

        // Validar la parte después del cuerpo
        if (!compararParte(tiposTokens.slice(-despuesCuerpo.length), despuesCuerpo)) return false;

        // Validar el cuerpo (puede contener literales y/o identificadores con separadores)
        const cuerpoTokens = tiposTokens.slice(antesCuerpo.length, tiposTokens.length - despuesCuerpo.length);
        return validarCuerpoEscribir(cuerpoTokens);
    } else {
        return compararParte(tiposTokens, gramatica);
    }
}

function compararParte(tiposTokens, gramatica) {
    if (tiposTokens.length !== gramatica.length) return false;
    for (let i = 0; i < tiposTokens.length; i++) {
        if (tiposTokens[i] !== gramatica[i]) {
            return false;
        }
    }
    return true;
}

function validarCuerpoEscribir(cuerpoTokens) {
    if (cuerpoTokens.length === 0) return false;

    for (let i = 0; i < cuerpoTokens.length; i++) {
        if (i % 2 === 0) { // Posiciones pares deben ser Literal de Cadena o Identificador
            if (cuerpoTokens[i] !== "Literal de Cadena" && cuerpoTokens[i] !== "Identificador") {
                return false;
            }
        } else { // Posiciones impares deben ser Separador
            if (cuerpoTokens[i] !== "Separador") {
                return false;
            }
        }
    }
    return cuerpoTokens.length % 2 === 1; // Debe terminar en Literal o Identificador
}

function mostrarErrores(errores) {
    const contenedorErrores = document.getElementById("erroresSintaxis");
    contenedorErrores.innerHTML = errores.replace(/\n/g, '<br>');
}