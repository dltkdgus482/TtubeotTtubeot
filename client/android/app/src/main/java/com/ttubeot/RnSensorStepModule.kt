package com.sensor.step

import android.Manifest
import android.app.Activity
import android.content.pm.PackageManager
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.sensor.step.RnSensorStepListener.SensorType

class RnSensorStepModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var sensorStepListener: RnSensorStepListener? = null

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun requestSensorPermission() {
        val activity: Activity? = currentActivity
        val permissions = arrayOf(Manifest.permission.ACTIVITY_RECOGNITION)
        activity?.requestPermissions(permissions, 0)
    }

    @RequiresApi(Build.VERSION_CODES.M)
    @ReactMethod
    fun checkSensorPermission(promise: Promise) {
        val permissionGranted = reactContext.checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED
        promise.resolve(permissionGranted)
    }

    @ReactMethod
    fun start(delay: Int, sensorType: String) {
        if (sensorStepListener == null) {
            sensorStepListener = RnSensorStepListener(reactContext)
        }
        val type = SensorType.fromString(sensorType) ?: SensorType.COUNTER
        sensorStepListener?.start(delay, type)
    }

    @ReactMethod
    fun stop() {
        sensorStepListener?.stop()
    }

     @ReactMethod
    fun addListener(eventName: String) {
        // NativeEventEmitter와의 호환을 위한 더미 메서드
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // NativeEventEmitter와의 호환을 위한 더미 메서드
    }

    override fun getName(): String {
        return "RnSensorStep"
    }
}
