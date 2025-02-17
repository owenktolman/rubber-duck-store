import Duck from '../models/duck.model.js'

export const findDuckByValues = async (values) => {
    return Duck.findOne(values)
}
