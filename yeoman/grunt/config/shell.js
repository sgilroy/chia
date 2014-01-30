module.exports = {
	iossimstart: {
		command: "ios-sim launch ../platforms/ios/build/emulator/Chia.app --exit<%= device.family !== 'default' ? ' --family ' + device.family : '' %>",
        options: {
            stdout: true
        }
    },
    iossimend: {
        command: 'killall -9 "iPhone Simulator"'
    },
    serveend: {
        command: 'killall -9 "cordova serve"'
    },
    rippleend: {
        command: 'killall -9 "cordova ripple"'
    },
    updateBackend: {
        command: './test/scripts/server.sh -u',
        options: {
            stdout: true
        }
    },
    startBackend: {
        command: './test/scripts/server.sh -s',
        options: {
            stdout: true,
            async: true
        }
    },
    stopBackend: {
        command: './test/scripts/server.sh -k',
        options: {
            stdout: true
        }
    },
    packageIOSDevelopmentBuild: {
        command: 'platforms/ios/distribution/build.sh -m development'
    },
    packageIOSADHocBuild: {
        command: 'platforms/ios/distribution/build.sh -m adhoc'
    },
    "ios-deploy": {
        command: "platforms/ios/ios-deploy/ios-deploy -b build/Debug-ios/Chia.app"
    }

};
