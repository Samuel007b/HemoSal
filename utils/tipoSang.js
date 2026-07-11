const tiposParaEnum = {
    "A+": "A_POSITIVO",
    "A-": "A_NEGATIVO",
    "B+": "B_POSITIVO",
    "B-": "B_NEGATIVO",
    "AB+": "AB_POSITIVO",
    "AB-": "AB_NEGATIVO",
    "O+": "O_POSITIVO",
    "O-": "O_NEGATIVO",
    A_POSITIVO: "A_POSITIVO",
    A_NEGATIVO: "A_NEGATIVO",
    B_POSITIVO: "B_POSITIVO",
    B_NEGATIVO: "B_NEGATIVO",
    AB_POSITIVO: "AB_POSITIVO",
    AB_NEGATIVO: "AB_NEGATIVO",
    O_POSITIVO: "O_POSITIVO",
    O_NEGATIVO: "O_NEGATIVO"
};

const tiposFormatados = {
    A_POSITIVO: "A+",
    A_NEGATIVO: "A-",
    B_POSITIVO: "B+",
    B_NEGATIVO: "B-",
    AB_POSITIVO: "AB+",
    AB_NEGATIVO: "AB-",
    O_POSITIVO: "O+",
    O_NEGATIVO: "O-"
};

export function transformaTipo(tipoSang) {
    const tipo = tiposParaEnum[tipoSang?.toUpperCase()];
    if (!tipo) {
        throw new Error("Tipo sanguíneo inválido");
    }
    return tipo;
}

export function formataTipo(tipoSang) {
    const tipo = tiposFormatados[tipoSang];
    if (!tipo) {
        throw new Error("Tipo sanguíneo inválido");
    }
    return tipo;
}