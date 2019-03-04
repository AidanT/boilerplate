const defaults = {

}

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export default Object.assign(defaults, require(`./${env}`))
