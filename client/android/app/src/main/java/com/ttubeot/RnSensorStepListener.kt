package com.sensor.step

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class RnSensorStepListener(private val reactContext: ReactApplicationContext) : SensorEventListener {

    private var sensorManager: SensorManager = reactContext.getSystemService(ReactApplicationContext.SENSOR_SERVICE) as SensorManager
    private var stepCounterSensor: Sensor? = null
    private var sensorType: Int = Sensor.TYPE_STEP_COUNTER
    private var lastUpdate: Long = 0
    private var delay: Int = 0

    private var initialStepCount: Float? = null

    enum class SensorType(val type: String) {
        COUNTER("COUNTER"),
        DETECTOR("DETECTOR");

        companion object {
            fun fromString(value: String): SensorType? = values().find { it.type == value }
        }
    }

    fun start(delay: Int, sensorType: SensorType) {
        this.delay = delay
        this.sensorType = if (sensorType == SensorType.COUNTER) Sensor.TYPE_STEP_COUNTER else Sensor.TYPE_STEP_DETECTOR
        stepCounterSensor = sensorManager.getDefaultSensor(this.sensorType)
        stepCounterSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_FASTEST)
        }

        initialStepCount = null
    }

    fun stop() {
        sensorManager.unregisterListener(this)
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: RuntimeException) {
            Log.e("ERROR", "Trying to invoke JS before CatalystInstance has been set!", e)
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            if (it.sensor.type == sensorType) {
                val curTime = System.currentTimeMillis()
                if (curTime - lastUpdate > delay) {
                  if (initialStepCount == null) {
                        initialStepCount = it.values[0]
                    }
                    val adjustedSteps = it.values[0] - (initialStepCount ?: 0f)
                    
                    val map: WritableMap = Arguments.createMap()
                    map.putDouble("steps", it.values[0].toDouble())
                    sendEvent("StepCounter", map)
                    lastUpdate = curTime
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not used
    }
}
