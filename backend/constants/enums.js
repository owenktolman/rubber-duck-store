/**
 * Available duck colors
 * @readonly
 * @enum {{ name: string, hex: string }}
 */
export const DuckColorEnum = Object.freeze({
    RED: { name: 'Red', hex: '#FF0000' },
    GREEN: { name: 'Green', hex: '#00FF00' },
    YELLOW: { name: 'Yellow', hex: '#FFFF00' },
    BLACK: { name: 'Blue', hex: '#000000' },
})

/**
 * Available duck sizes and their associated package types
 * @readonly
 * @enum {{ name: string }}
 */
export const DuckSizeEnum = Object.freeze({
    XLARGE: { name: 'XLarge', packageType: 'Wood' },
    LARGE: { name: 'Large', packageType: 'Wood' },
    MEDIUM: { name: 'Medium', packageType: 'Cardboard' },
    SMALL: { name: 'Small', packageType: 'Plastic' },
    XSMALL: { name: 'XSmall', packageType: 'Plastic' },
})

/**
 * Country codes with unique price % increments
 * @readonly
 * @enum { string: float }
 */
export const ShippingDestinationEnum = Object.freeze({
    'USA': 0.18,
    'BOL': 0.13,
    'IND': 0.19,
    'default': 0.15,
})

export const getDuckSizeEnum = (name) => {
    const s = Object.keys(DuckSizeEnum).filter(s => DuckSizeEnum[s].name === name)
    return DuckSizeEnum[s]
}

export const getDuckColorEnum = (name) => {
    const c = Object.keys(DuckColorEnum).filter(c => DuckColorEnum[c].name === name)
    return DuckColorEnum[c]
}
