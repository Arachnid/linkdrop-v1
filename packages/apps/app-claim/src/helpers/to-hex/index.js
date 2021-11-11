function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}
export default toHex