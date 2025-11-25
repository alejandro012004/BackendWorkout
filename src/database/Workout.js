const DB = require("./db.json");
const fs = require("fs");
const path = require("path");

const parseUSDate = (str) => {
    if (!str || typeof str !== 'string') return new Date(0); // fallback

    const [datePart, timePart] = str.split(', ');
    const [month, day, year] = datePart.split('/');
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`);
};


const getAllWorkouts = (filterParams) => {

    //Si no tiene filtros devolvemos todo el array
    if (!filterParams.mode && !filterParams.limit && !filterParams.sortDate) {
        return DB.workouts;
    }

    //Comprobamos si hay filtro y vamos filtrando segun el filtro
    let resultado = DB.workouts;

    resultado.forEach((elemento) => {
        console.log();
        new Date(elemento.createdAt);
    })

    if (filterParams.sortDate == 'desc') {
        resultado = resultado
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filterParams.sortDate == 'asc') {
        resultado = resultado
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (filterParams.mode) {
        resultado = resultado.filter((workout) =>
            workout.mode.toLowerCase().includes(filterParams.mode))
    }

    if (filterParams.limit) {
        return resultado.splice(0, filterParams.limit)
    }

    return resultado;
};


const getOneWorkout = (workoutId) => {
    try {
        const workout = DB.workouts.find((workout) => workout.id === workoutId);
        if (!workout) {
            throw {
                status: 400,
                message: `Can't find workout with the id '${workoutId}'`,
            }
        }
        return workout;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    }
}

const createNewWorkout = (newWorkout) => {
    const isAlreadyAdded =
        DB.workouts.findIndex((workout) => workout.name == newWorkout.name) > -1;
    if (isAlreadyAdded) {
        throw {
            status: 400,
            message: `Workout with the name '${newWorkout.name}' already exists`,
        }
    }
    try {
        DB.workouts.push(newWorkout);
        saveToDatabase(DB);
        return newWorkout;
    } catch (error) {
        throw { status: 500, message: error?.message || error };
    }
};

const updateOneWorkout = (workoutId, changes) => {
    console.log(changes)
    try {
        const isAlreadyAdded =
            DB.workouts.findIndex((workout) => workout.name === changes.name) > -1;
        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Workout with the name '${changes.name}' already exists`
            };
        }
        const indexForUpdate = DB.workouts.findIndex((workout) => workout.id === workoutId
        );
        if (indexForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find workout with the id '${workoutId}'`,
            };
        }
        const updatedWorkout = {
            ...DB.workouts[indexForUpdate],
            ...changes,
            updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        };
        DB.workouts[indexForUpdate] = updatedWorkout;
        saveToDatabase(DB);
        return updatedWorkout;
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    }
};

const deleteOneWorkout = (workoutId) => {
    console.log(workoutId);
    try {
        const indexForDeletion = DB.workouts.findIndex(
            (workout) => workout.id === workoutId
        );
        if (indexForDeletion === -1) {
            throw {
                status: 400,
                message: `Can't find workout with the id '${workoutId}'`,
            };
        }
        DB.workouts.splice(indexForDeletion, 1);
        saveToDatabase(DB);
    } catch (error) {
        throw { status: error?.status || 500, message: error?.message || error };
    }
};

const saveToDatabase = (DB) => {
    fs.writeFileSync("./src/database/db.json", JSON.stringify(DB, null, 2), {
        encoding: "utf8"
    });

}

module.exports = {
    getAllWorkouts,
    getOneWorkout,
    createNewWorkout,
    updateOneWorkout,
    deleteOneWorkout,
}