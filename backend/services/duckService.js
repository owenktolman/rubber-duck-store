import Duck from '../models/duck.model.js'

export const getAllDucks = async () => {
    return Duck.find()
}

export const getDuckByValues = async (values) => {
    return Duck.findOne(values)
}

export const getDuckAndDelete = async (values) => {
    return Duck.findOneAndDelete(values)
}

export const updateDuck = async (duckId, newValues) => {
    return Duck.findByIdAndUpdate(duckId, newValues, { new: false })
}
