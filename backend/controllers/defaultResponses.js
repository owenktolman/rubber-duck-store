export const badReqResp = (res, msg) => {
    return res.status(400).json({ success: false, message: 'Bad Request: ' + msg })
}

export const internalErrResp = (res, msg) => {
    return res.status(500).json({ success: false, message: 'Internal Server Error: ' + msg })
}

export const successResp = (res, msg) => {
    return res.status(201).json({ success: true, data: msg })
}

export const notFoundResp = (res, msg) => {
    return res.status(404).json({ success: false, message: 'Not Found: ' + msg })
}
