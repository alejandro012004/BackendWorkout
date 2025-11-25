const workoutService = require("../services/workoutService")



const getAllWorkouts = (req, res) => {
    const { mode } = req.query;
    const { limit } = req.query;
    const { sortDate } = req.query;
    try {
        //const allWorkouts = workoutService.getAllWorkouts();
        const allWorkouts = workoutService.getAllWorkouts({ mode,limit,sortDate });
        res.send({status: "OK", data: allWorkouts});
    } catch (error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: {error: error?.message || error}})
    }
};

const getOneWorkout = (req, res) => {
    const {
        params: { workoutId },
    } = req;
    console.log("🟡 ID recibido:", workoutId);
    if (!workoutId) {
        res
        .status(400)
        .send({
            status: "FAILED",
            data: {
                error: "Parameter ':workoutId' can not be empty"
            },
        });
    }

    try{
        const workout = workoutService.getOneWorkout(workoutId);
        res.send({status: "OK", data: workout});
    } catch (error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: {error: error?.message || error}})
    }
}

const createNewWorkout = (req, res) => {
    const { body } = req;
    if(
        !body.name ||
        !body.mode ||
        !body.equipment ||
        !body.trainerTips
    ) {
    return res.status(400).send({
        status: "FAILED",
        data: { error: "Faltan campos requeridos en el cuerpo de la petición." }
    });
    }
    const newWorkout = {
        name : body.name,
        mode : body.mode,
        equipment : body.equipment,
        trainerTips : body.trainerTips,
    };
    try {
        const createNewWorkout = workoutService.createNewWorkout(newWorkout);
        res.status(201).send({ status: "OK", data: createNewWorkout});
    } catch (error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: {error: error?.message || error}})
    }
};

const updateOneWorkout = (req, res) => {
    const {
        body,
        params: { workoutId },
    } = req;
    if(!workoutId){
        res
        .status(400)
        .send({
            status: "FAILED",
            data: { error: "Parameter ':workoutId' can not be empty"},
        });
    }
    try{
        const updatedWorkout = workoutService.updateOneWorkout(workoutId, body);
        res.send({status : "OK", data: updatedWorkout});        
    }catch(error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error}});
    }
};

const deleteOneWorkout = (req, res) => {
    const{
        params: { workoutId },
    } = req;
    if(!workoutId) {
        res
        .status(400)
        .send({
            status: "FAILED",
            data: { error: "Parameter ':workoutId' can not be empty" },
        });
    }
    try{
        workoutService.deleteOneWorkout(workoutId);
        res.status(204).send({ status: "OK"});
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error}});
    }
};


module.exports = {
    getAllWorkouts,
    getOneWorkout,
    createNewWorkout,
    updateOneWorkout,
    deleteOneWorkout,
};