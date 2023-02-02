module.exports = {
	udbAdd( udb, data ) {
		udb.add( data, {
			success: res => {
				// 新增成功后的回调
				console.log( res );
			},
			fail: err => {
				// 新增失败后的回调
				console.log( err );
			},
			complete: () => {
				// 完成后的回调
			}
		} );
	},
	udbQuery( udb ) {
		console.log( udb?.dataList )
		return udb?.dataList;
	}
}
