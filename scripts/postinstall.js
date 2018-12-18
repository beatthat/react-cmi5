const path = require('path')
const fs = require('fs-extra')
const appRoot = require('app-root-path').path

const installCmi5Lib = async() => {
	const srcPath = path.join(
		appRoot, 'node_modules', 'react-cmi5', 'src', 'cmi5.js'
	)

	const tgtPath = path.join(appRoot, 'public', 'cmi5.js')

	await fs.ensureDir(path.dirname(tgtPath))

	await fs.copyFile(srcPath, tgtPath)
}

installCmi5Lib()