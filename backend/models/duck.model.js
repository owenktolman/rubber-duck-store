import mongoose, {Schema} from 'mongoose'

const duckSchema = new mongoose.Schema({
    id: {
        type: Schema.Types.Int32,
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    price: {
        type: Schema.Types.Double,
    },
    quantity: {
        type: Schema.Types.Int32,
        default: 0,
    },
    deleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true // createdAt updatedAt
})

const Duck = mongoose.model('Duck', duckSchema)

export default Duck
