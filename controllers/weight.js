const currentWeight = require("../models/weight");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllWeights = async (req, res) => {
  const weights = await currentWeight
    .find({ createdBy: req.user.userId })
    .sort("createdAt");
  res.status(StatusCodes.OK).json({ weights, count: weights.length });
};

const getWeight = async (req, res) => {
  const {
    user: { userId },
    params: { id: currentWeightId },
  } = req;

  const weight = await currentWeight.findOne({
    _id: currentWeightId,
    createdBy: userId,
  });
  if (!weight) {
    throw new NotFoundError(`No weight with id ${currentWeightId}`);
  }
  res.status(StatusCodes.OK).json({ weight });
};

const createWeight = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const weight = await currentWeight.create(req.body);
  res.status(StatusCodes.CREATED).json({ weight });
};

const updateWeight = async (req, res) => {
  const {
    body: { currentWeight },
    user: { userId },
    params: { id: currentWeightID },
  } = req;

  if (currentWeight === "") {
    throw new BadRequestError("Current Weight field cannot be empty");
  }
  const weight = await currentWeight.findByIdAndUpdate(
    { _id: currentWeightId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!weight) {
    throw new NotFoundError(`No weight with id ${currentWeightId}`);
  }
  res.status(StatusCodes.OK).json({ weight });
};

const deleteWeight = async (req, res) => {
  const {
    user: { userId },
    params: { id: currenrtWeightId },
  } = req;

  const weight = await currentWeight.findByIdAndRemove({
    _id: currentWeightId,
    createdBy: userId,
  });
  if (!weight) {
    throw new NotFoundError(`No weight with id ${goalId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: " The weight was successfully deleted" });
};

module.exports = {
  createWeight,
  deleteWeight,
  getAllWeights,
  updateWeight,
  getWeight,
};
