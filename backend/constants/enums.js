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
 * Available duck sizes
 * @readonly
 * @enum {{ name: string }}
 */
export const DuckSizeEnum = Object.freeze({
    XLARGE: { name: 'XLarge' },
    LARGE: { name: 'Large' },
    MEDIUM: { name: 'Medium' },
    SMALL: { name: 'Small' },
    XSMALL: { name: 'XSmall' },
})
