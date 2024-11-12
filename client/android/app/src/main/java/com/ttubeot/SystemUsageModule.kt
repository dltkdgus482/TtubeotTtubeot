package com.ttubeot

import android.app.ActivityManager
import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.RandomAccessFile

class SystemUsageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SystemUsage"
    }

    @ReactMethod
    fun getSystemUsage(promise: Promise) {
        try {
            val activityManager = reactApplicationContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            val memoryInfo = ActivityManager.MemoryInfo()
            activityManager.getMemoryInfo(memoryInfo)

            // 메모리 정보
            val totalMemory = memoryInfo.totalMem
            val availableMemory = memoryInfo.availMem

            // WritableMap 생성
            val result = Arguments.createMap().apply {
                putDouble("totalMemory", totalMemory.toDouble())
                putDouble("availableMemory", availableMemory.toDouble())
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("Error", e.message)
        }
    }
}
