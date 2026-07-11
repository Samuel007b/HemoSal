const sexosParaEnum = {
    M: "MASCULINO",
    MASCULINO: "MASCULINO",
    F: "FEMININO",
    FEMININO: "FEMININO",
    O: "OUTRO",
    OUTRO: "OUTRO"
};

const sexosFormatados = {
    MASCULINO: "M",
    FEMININO: "F",
    OUTRO: "O"
};

export function transformaSexo(sexo) {
    const resultado = sexosParaEnum[sexo?.toUpperCase()];
    if (!resultado) {
        throw new Error("Sexo inválido");
    }
    return resultado;
}

export function formataSexo(sexo) {
    const resultado = sexosFormatados[sexo];
    if (!resultado) {
        throw new Error("Sexo inválido");
    }
    return resultado;
}