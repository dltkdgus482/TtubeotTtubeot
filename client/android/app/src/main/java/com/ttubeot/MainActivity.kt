package com.ttubeot

import com.facebook.react.ReactActivity
import android.os.Bundle
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.nfc.tech.Ndef
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate

class MainActivity : ReactActivity() {
  private var nfcAdapter: NfcAdapter? = null

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ttubeot"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState) // 또는 super.onCreate(savedInstanceState) 사용 가능
    nfcAdapter = NfcAdapter.getDefaultAdapter(this)
    // In order to handle permission contract results, we need to set the permission delegate.
    HealthConnectPermissionDelegate.setPermissionDelegate(this)
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
