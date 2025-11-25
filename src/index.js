const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const v1WorkoutRouter = require("./v1/routes/workoutRoutes")

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//     res.send("<h1>Servidor basico funcionando a tope!</h1>");
// });
app.use(cors());

app.use(bodyParser.json());//app.use(express.json())
app.use("/api/v1/workouts", v1WorkoutRouter)


app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});





