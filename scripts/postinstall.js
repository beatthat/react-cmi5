const path = require('path')
const fs = require('fs-extra')
const appRoot = require('app-root-path').path

const installCmi5Lib = async() => {
	const srcPath = path.join(
		appRoot, 'node_modules', 'react-cmi5', 'src', 'cmi5.js'
	)

	try {
		if(!await fs.exists(srcPath)) {
			console.warn(`react-cmi5 should install client lib 'cmi5.js' to public in the react project where it is installed, but library not found at ${srcPath}`)
			// we probably are inside the react-cmi project itself and did `npm install`
			// there's no reason to do this library install in that context.
			// The library install is for clients/projects that *use* react-cmi5
			return
		}
		const tgtPath = path.join(appRoot, 'public', 'cmi5.js')
		console.log(`react-cmi5 will attempt to install client lib from ${srcPath} to ${tgtPath}...`)
		const tgtPath = path.join(appRoot, 'public', 'cmi5.js')
		await fs.ensureDir(path.dirname(tgtPath))
		await fs.copyFile(srcPath, tgtPath)
	}
	catch(err) {
		console.error(`failed to install cmi5.js lib with error ${err.message}`)
	}
}

installCmi5Lib()