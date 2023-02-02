module.exports = {
	say( text ) {
		if ( text ) {
			return {
				code: 200,
				message: `hello my text is ${text}`
			}
		} else {
			return {
				code: 400,
				message: `not found text`
			}
		}
	}

}
