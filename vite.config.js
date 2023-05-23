import base from './start/vite/default.vite.config.js'
import folder from './start/vite'

/** @type {import('vite').UserConfig} */
const config = {
	// make the route folder config to be appened first
	...folder,
	plugins: [...base.plugins],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	resolve: {
		alias: {
			...base.resolve.alias,

			// append any aliases coming from the route folder config
			...folder?.resolve?.alias
		}
	},
	server: {
		hmr: {overlay: false}, // 禁用或配置 HMR 连接 设置 server.hmr.overlay 为 false 可以禁用服务器错误遮罩层
	}
}

export default config
