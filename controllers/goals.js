const Goal = require("../models/goals");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllGoals = async (req, res) => {
  const goals = await Goal.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ goals, count: goals.length });
};

const getGoal = async (req, res) => {
  const {
    user: { userId },
    params: { id: goalId },
  } = req;

  const goal = await Goal.findOne({
    _id: goalId,
    createdBy: userId,
  });
  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalId}`);
  }
  res.status(StatusCodes.OK).json({ goal });
};

const createGoal = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const goal = await Goal.create(req.body);
  res.status(StatusCodes.CREATED).json({ goal });
};

const updateGoal = async (req, res) => {
  const {
    body: { weigthGoal, status },
    user: { userId },
    params: { id: goalId },
  } = req;

  if (weigthGoal === "" || status === "") {
    throw new BadRequestError("Weight Goal or Status fields cannot be empty");
  }
  const goal = await Goal.findByIdAndUpdate(
    { _id: goalId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalId}`);
  }
  res.status(StatusCodes.OK).json({ goal });
};

const deleteGoal = async (req, res) => {
  const {
    user: { userId },
    params: { id: goalId },
  } = req;

  const goal = await Goal.findByIdAndRemove({
    _id: goalId,
    createdBy: userId,
  });
  if (!goal) {
    throw new NotFoundError(`No goal with id ${goalId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: " The goal was successfully deleted" });
};

module.exports = {
  createGoal,
  deleteGoal,
  getAllGoals,
  updateGoal,
  getGoal,
};
