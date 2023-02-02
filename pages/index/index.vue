<template>
	<view class="content">
		<view class="title"><text>测一测你的性格</text></view>
		<unicloud-db @load="loadData" v-slot:default="{ data, loading, error, options }" ref="udb" field="result" getone="true" collection="character">
			<view v-if="error">{{ error.message }}</view>
			<view v-else></view>
		</unicloud-db>
		<radio-group @change="radioChange" v-for="(item, index) in qusitions" :key="index">
			<view class="uni-list">
				<view class="uni-question">
					<text>问题{{ index + 1 }}：{{ item.q }}</text>
				</view>
				<label class="uni-ask">
					<radio class="uni-radio" :value="strVal({ ask: item.ia, index: index })" :checked="checklist.length > 0 && checklist[index].ia === item.ia" />
					{{ item.a }}
				</label>
				<label class="uni-ask">
					<radio class="uni-radio" :value="strVal({ ask: item.ib, index: index })" :checked="checklist.length > 0 && checklist[index].ib === item.ib" />
					{{ item.b }}
				</label>
			</view>
		</radio-group>
		<view class="uni-result" v-if="qusitions.length > 0"><button type="primary" @tap="submit">提交测试查看结果</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			qusitions: [],
			error_code: -1,
			checklist: []
		};
	},
	onReady() {
		this.getQuestions();
	},
	watch: {
		error_code(nv, lv) {
			console.log(nv, lv);
		}
	},
	methods: {
		getQuestions() {
			const _this = this;
			uni.request({
				method: 'POST',
				url: '/juhe/fapig/character_test/questions', //仅为示例，并非真实接口地址。
				data: {
					key: '6b84d7a5413d41c47ef18e70a0dfcad7',
					level: 'senior'
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					const udbfn = uniCloud.importObject('uni-udbfn');
					_this.error_code = res?.data?.error_code;
					if (res?.data?.error_code === 0) {
						_this.qusitions = res?.data?.result;
						_this.checklist = new Array(res?.data?.result.length).fill('');
						udbfn.udbAdd(_this.$refs.udb, res?.data);
					} else if (res.data.error_code === 10012) {
						console.log(res?.data?.reason);
					}
				},
				fail: error => {
					console.log(error);
				}
			});
		},
		loadData(data) {
			console.log(data.result, this.error_code);
			this.error_code != 0 && ((this.qusitions = data?.result), (this.checklist = new Array(data?.result.length).fill('')));
		},
		strVal({ ask, index }) {
			return JSON.stringify({ ask, index });
		},
		radioChange(evt) {
			if (evt.target.value) {
				let checklist = this.checklist;
				const askJson = JSON.parse(evt.target.value);
				checklist[askJson.index] = askJson.ask;
				this.checklist = checklist;
				console.log(this.checklist);
			}
		},
		submit() {
			console.log(this.checklist.length, this.checklist.every(item => item));
			if (!this.checklist.every(item => item)) {
				uni.showToast({
					icon: 'none',
					title: '请答完所有题目再提交',
					duration: 2000
				});
				return false;
			}
			uni.request({
				method: 'POST',
				url: '/juhe/fapig/character_test/analysis', //仅为示例，并非真实接口地址。
				data: {
					key: '6b84d7a5413d41c47ef18e70a0dfcad7',
					answers: this.checklist.toString()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				success: res => {
					console.log(res);
				},
				fail: error => {
					console.log(error);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.content {
	padding: 15px;
	background-color: #ed9;
	.title {
		text-align: center;
		margin-bottom: $uni-margin-big;
		color: $uni-color-primary;
		font-size: $uni-font-size-lbig;
	}
	.uni-list {
		padding: 5px;
		display: block;
		margin-top: $uni-margin-base;
		.uni-question {
			font-size: $uni-font-size-lg;
			margin-bottom: $uni-margin-sm;
		}
		.uni-ask {
			font-size: $uni-font-size-base;
			align-items: center;
			justify-items: center;
			display: flex;
			.uni-radio {
				transform: scale(0.5);
				-webkit-transform: scale(0.5);
			}
		}
	}
	.uni-result {
		margin-top: $uni-margin-big;
		text-align: center;
	}
}
</style>
