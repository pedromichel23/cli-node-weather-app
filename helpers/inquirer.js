import inquirer from 'inquirer';
import colors from 'colors';

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad.`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial.`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir.`
            },
        ]
    }
]

export async function inquirerMenu() {
    console.clear();
    console.log("=======================".green);
    console.log(" Seleccione una opcion: ".white);
    console.log("=======================\n".green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}


export async function pausa() {
    const pregunta = [
        {
            type: 'input',
            name: 'pregunta',
            message: `Presiona ${'Enter'.green} para continuar:`
        }
    ];

    console.log('\n');
    await inquirer.prompt(pregunta);
}

export async function leerInput(message) {
    const pregunta = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate(value) {
                if (value.length == 0) {
                    return 'Porfavor ingrese un valor'
                }
                return true
            }

        }
    ];

    const { desc } = await inquirer.prompt(pregunta);
    return desc;
}

export async function listarLugares(lugares = []) {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}`.green
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });
    choices.unshift({
        value: 0,
        name: '0. '.green + 'Cancelar'
    });
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices
        }
    ]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

export async function confirmar(message) {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]

    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}