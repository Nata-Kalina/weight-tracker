const express = require("express");

const router = express.Router();
const {
  createGoal,
  deleteGoal,
  getAllGoals,
  updateGoal,
  getGoal,
} = require("../controllers/goals");

router.route("/").post(createGoal).get(getAllGoals);

router.route("/:id").get(getGoal).delete(deleteGoal).patch(updateGoal);

module.exports = router;
