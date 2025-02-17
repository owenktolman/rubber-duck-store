import express from 'express'
import {
    createDuck,
    getAllDucks,
    updateDuck,
    getDuckConstants,
    orderDucks
} from '../controllers/duck.controller.js'

const router = express.Router()

/**
 * Gets all ducks from db
 *
 * @return {Array} array of duck objects
 */
router.get("/", getAllDucks)

/**
 * Gets all constant values relating to ducks
 *
 * @return {json} Object that contains constants objects
 */
router.get("/constants", getDuckConstants)

/**
 * Creates a new duck in the db
 *
 * @param {json} duck new duck data
 *      @param {String} duck.color duck color string related to DuckColorEnum
 *      @param {String} duck.size duck size string related to DuckSizeEnum
 *      @param {Double} duck.price duck price in usd
 *      @param {Integer} duck.quantity duck quantity
 *
 * @return {json} new duck object
 */
router.post("/duck/", createDuck)

/**
 * Update existing duck in db
 *
 * @param {String} duck._id the _id of the duck to be updated
 * @param {json} duck new duck data
 *      @param {String} duck.color duck color string related to DuckColorEnum
 *      @param {String} duck.size duck size string related to DuckSizeEnum
 *      @param {Double} duck.price duck price in usd
 *      @param {Integer} duck.quantity duck quantity
 *      @param {Boolean} duck.deleted whether the duck is deleted or not
 *
 * @return {json} updated duck object
 */
router.post("/duck/:id", updateDuck)

/**
 * Orders ducks from warehouse
 *
 * @param {json} body object containing all necessary info in body
 *      @param {String} destination destination country
 *      @param {String} shippingMode method of shipping (Land, Air, Sea)
 *      @param {json} duck ducks to order
 *          @param {String} duck.color duck color string related to DuckColorEnum
 *          @param {String} duck.size duck size string related to DuckSizeEnum
 *          @param {Double} duck.price duck price in usd
 *          @param {Integer} duck.quantity duck quantity
 *
 * @return {json} shippingInfo object containing all shipping info
 *      @return {String} packageType package container material
 *      @return {Array} protectionType Array of strings packaging protection material
 *      @return {Double} totalPrice total price in usd
 *      @return {json} itemizedPayments object of itemized discounts and increments
 */
router.post("/order", orderDucks)

export default router
