import Duck from '../models/duck.model.js'
import {badReqResp, internalErrResp, notFoundResp, successResp} from './defaultResponses.js'
import {getDuckByValues, getIsDuckValid, updateDuck} from '../services/duckService.js'
import {
    DuckColorEnum,
    DuckSizeEnum,
    getDuckColorEnum,
    getDuckSizeEnum,
    ShippingDestinationEnum
} from '../constants/enums.js'
import res from 'express/lib/response.js'

export const getDuckConstants = async (req, res) => {
    try {
        const constants = {
            duckColors: DuckColorEnum,
            duckSizes: DuckSizeEnum,
        }
        return successResp(res, constants)
    } catch (error) {
        return internalErrResp(res, error.message)
    }
}

export const getAllDucks = async (req, res) => {
    try {
        const ducks = await Duck.find({})
        return successResp(res, ducks)
    } catch (error) {
        console.log('Error getting ducks', error.message)
        return internalErrResp(res, error.message)
    }
}

export const createDuck = async (req, res) => {
    const duck = req.body

    //required fields to create new duck
    if (!duck.color || !duck.size || duck.price < 0 || duck.quantity < 0) {
        return badReqResp(res, 'Please provide all required fields')
    }
    //check for invalid colors or sizes
    if (!getDuckColorEnum(duck.color) || !getDuckSizeEnum(duck.size)) {
        return badReqResp(res, 'Invalid duck values')
    }

    let existingDuck = await getDuckByValues({
        color: duck.color,
        size: duck.size,
        price: duck.price,
        deleted: false //only get existing undeleted ducks
    })

    if (existingDuck) {
        existingDuck.quantity = parseInt(existingDuck.quantity) + parseInt(duck.quantity)

        try {
            const updatedDuck = await updateDuck(existingDuck._id, existingDuck)
            return successResp(res, updatedDuck)
        } catch (error) {
            console.error('Error creating Duck: ', error.message)
            return internalErrResp(res, error.message)
        }
    } else {
        if (!duck.id) {
            //increment id, nothing is ever removed from db so no need to worry about duplicates
            const count = await Duck.countDocuments({})
            duck.id = count + 1
        }
        const newDuck = new Duck(duck)
        try {
            await newDuck.save()
            return successResp(res, newDuck)
        } catch (error) {
            console.error('Error creating Duck: ', error.message)
            return internalErrResp(res, error.message)
        }
    }
}

export const editDuck = async (req, res) => {
    const { id } = req.params // id here is _id, not integer id
    const duck = req.body
    if (!await getIsDuckValid(id)) {
        return notFoundResp(res, 'Please provide a valid duck id')
    }

    try {
        const updatedDuck = await updateDuck(id, duck)
        return successResp(res, updatedDuck)
    } catch (error) {
        console.log('Error updating Duck at id ' + id + ': ', error.message)
        return internalErrResp(res, error.message)
    }
}

const itemizePayments = (base, data, packageType) => {
    const discounts = []
    const increments = []
    const quantity = parseInt(data.duck.quantity)
    const baseCost = parseInt(base)

    const addPercentDiscount = (multiplier, reason) => {
        discounts.push({
            amount: parseFloat((baseCost * multiplier).toFixed(2)),
            reason: reason,
        })
    }

    const addPercentIncrement = (multiplier, reason) => {
        increments.push({
            amount: parseFloat((baseCost * multiplier).toFixed(2)),
            reason: reason,
        })
    }

    //discounts or increments from quantity
    if (quantity > 100) addPercentDiscount(0.2, 'Bulk Discount')

    //discounts or increments from packaging
    switch (packageType) {
        case 'Wood':
            addPercentIncrement(0.05, 'Wood Packaging Cost')
            break
        case 'Plastic':
            addPercentIncrement(0.1, 'Plastic Packaging Cost')
            break
        case 'Cardboard':
            addPercentDiscount(0.01, 'Cardboard Packaging Discount')
            break
        default:
            return internalErrResp(res, 'Error handling packaging type')
    }

    //discounts or increments from shipping destination
    addPercentIncrement((ShippingDestinationEnum[data.destination] || ShippingDestinationEnum['default']), 'Shipping Cost')

    //discounts or increments from shipping method
    switch (data.shippingMode) {
        case 'Sea':
            increments.push({ amount: 400, reason: 'Sea Shipping'})
            break
        case 'Land':
            increments.push({ amount: quantity * 10, reason: 'Land Shipping' })
            break
        case 'Air':
            let increment = quantity * 30
            increments.push({ amount: increment, reason: 'Air Shipping' })
            if (quantity > 1000) discounts.push({ amount: parseFloat((increment * 0.15).toFixed(2)), reason: 'Bulk Air Shipping' }) //itemized separately
            break
        default:
            return internalErrResp(res, 'Error handling shipping mode')
    }

    return {discounts, increments}
}

export const orderDucks = async (req, res) => {
    const data = req.body

    //verify needed data exists
    if (!data.destination || !data.shippingMode || !data.duck) {
        return badReqResp(res, 'Please provide all required fields')
    }
    //verify that duck to be ordered is real and not deleted
    if (!data.duck?._id || !await getIsDuckValid(data.duck._id)) {
        return internalErrResp(res, 'Could not verify duck is valid')
    } else if (!await getDuckByValues({ _id: data.duck._id, deleted: false })) {
        return badReqResp(res, 'Could not order deleted duck')
    }
    //verify duck size and color
    if (!getDuckSizeEnum(data.duck.size) || !getDuckColorEnum(data.duck.color)) {
        return badReqResp(res, 'Invalid duck size')
    }
    //verify duck quantity > 0
    if (data.duck.quantity <= 0) return badReqResp(res, 'Cannot order 0 or fewer ducks')

    const packageType = getDuckSizeEnum(data.duck.size).packageType
    if (!packageType) return internalErrResp(res, 'Error determining package type')

    let protectionType = []

    //determine package protection type based on package type and shipping mode
    switch(data.shippingMode) {
        case 'Air':
            if (packageType === 'Wood' || packageType === 'Cardboard') {
                protectionType.push('Polystyrene')
            }
            if (packageType === 'Plastic') {
                protectionType.push('Bubblewrap')
            }
            break
        case 'Land':
            protectionType.push('Polystyrene')
            break
        case 'Sea':
            protectionType.push('Beads')
            protectionType.push('Bubblewrap')
            break
        default:
            return internalErrResp(res, 'Error identifying shipping mode')
    }

    const quantity = parseFloat(data.duck.quantity).toFixed(0)
    const price = parseFloat(data.duck.price).toFixed(2)

    const baseCost = quantity * price

    const itemizedPayments = itemizePayments(baseCost, data, packageType)

    let totalPrice = baseCost
    Object.keys(itemizedPayments.increments).forEach(i => {totalPrice = totalPrice + parseFloat(itemizedPayments.increments[i].amount)})
    Object.keys(itemizedPayments.discounts).forEach(i => totalPrice = totalPrice - parseFloat(itemizedPayments.discounts[i].amount))

    const resp = {
        packageType: packageType,
        protectionType: protectionType,
        totalPrice: parseFloat((totalPrice).toFixed(2)),
        itemizedPayments: itemizedPayments,
    }

    return successResp(res, resp)
}
