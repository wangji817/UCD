// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	say(text) {
		if (text) {
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
