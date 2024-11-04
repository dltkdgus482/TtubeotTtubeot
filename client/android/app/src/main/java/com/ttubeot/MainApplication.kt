// package com.ttubeot

// import android.app.Application
// import com.facebook.react.PackageList
// import com.facebook.react.ReactApplication
// import com.facebook.react.ReactHost
// import com.facebook.react.ReactNativeHost
// import com.facebook.react.ReactPackage
// import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
// import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
// import com.facebook.react.defaults.DefaultReactNativeHost
// import com.facebook.soloader.SoLoader
// import com.viromedia.bridge.ReactViroPackage

// class MainApplication : Application(), ReactApplication {

//   override val reactNativeHost: ReactNativeHost =
//       object : DefaultReactNativeHost(this) {
//         override fun getPackages(): List<ReactPackage> =
//             PackageList(this).packages.apply {
//               // Packages that cannot be autolinked yet can be added manually here
//               add(ReactViroPackage(ReactViroPackage.ViroPlatform.valueOf("AR")))
//             }

//         override fun getJSMainModuleName(): String = "index"

//         override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

//         override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
//         override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
//       }

//   override val reactHost: ReactHost
//     get() = getDefaultReactHost(applicationContext, reactNativeHost)

//   override fun onCreate() {
//     super.onCreate()
//     SoLoader.init(this, false)
//     if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
//       // If you opted-in for the New Architecture, we load the native entry point for this app.
//       load()
//     }
//   }
// }
package com.ttubeot

import android.app.Application
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.viromedia.bridge.ReactViroPackage

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> {
                val packages = PackageList(this).packages.toMutableList()

                // 에뮬레이터가 아닐 때만 Viro 패키지를 추가
                if (!isRunningOnEmulator()) {
                    packages.add(ReactViroPackage(ReactViroPackage.ViroPlatform.AR))
                }

                return packages
            }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            load()
        }
    }

    // 에뮬레이터에서 실행 중인지 확인하는 함수
    private fun isRunningOnEmulator(): Boolean {
        return (Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic"))
                || Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.HARDWARE.contains("goldfish")
                || Build.HARDWARE.contains("ranchu")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || Build.PRODUCT.contains("sdk_google")
                || Build.PRODUCT.contains("google_sdk")
                || Build.PRODUCT.contains("sdk")
                || Build.PRODUCT.contains("sdk_x86")
                || Build.PRODUCT.contains("vbox86p")
                || Build.PRODUCT.contains("emulator")
                || Build.PRODUCT.contains("simulator")
    }
}
