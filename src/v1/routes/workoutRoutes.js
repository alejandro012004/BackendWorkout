const express = require("express");
const apicache = require("apicache");
const router = express.Router();
const workoutController = require("../../controllers/workoutController");
const cache = apicache.middleware;


router.get("/", cache("1 minutes"), workoutController.getAllWorkouts);

router.get("/:workoutId", workoutController.getOneWorkout);

router.post("/", workoutController.createNewWorkout)

router.patch("/:workoutId", workoutController.updateOneWorkout);

router.delete("/:workoutId", workoutController.deleteOneWorkout);

module.exports = router;