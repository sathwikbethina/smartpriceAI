package com.example.smartprice_ai

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.example.smartprice_ai/app_launcher"
    private var pendingLocationResult: MethodChannel.Result? = null
    private val LOCATION_PERMISSION_REQUEST_CODE = 1001

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "launchNativeApp" -> {
                    val url = call.argument<String>("url") ?: ""
                    val packageName = call.argument<String>("packageName") ?: ""
                    val candidatesList = call.argument<List<String>>("packageCandidates") ?: emptyList()
                    val allPackages = if (candidatesList.isNotEmpty()) candidatesList else listOfNotNull(packageName.ifEmpty { null })
                    
                    var launched = false

                    // 1. Guarded Native App Launch iterating through all known package variants
                    for (pkg in allPackages) {
                        if (pkg.isBlank()) continue
                        try {
                            val launchIntent = packageManager.getLaunchIntentForPackage(pkg)
                            if (launchIntent != null) {
                                // Try deep-linking via explicit package intent
                                if (url.isNotBlank()) {
                                    val viewIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                        setPackage(pkg)
                                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    }
                                    if (viewIntent.resolveActivity(packageManager) != null) {
                                        startActivity(viewIntent)
                                        launched = true
                                        break
                                    }
                                }
                                // Fallback to main launcher intent for that store
                                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                startActivity(launchIntent)
                                launched = true
                                break
                            }
                        } catch (e: Exception) {
                            // Continue to next package candidate
                        }
                    }

                    // 2. Safe Fallback to Chrome / Default Browser if native app cannot be launched
                    if (!launched && url.isNotBlank()) {
                        try {
                            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            }
                            startActivity(browserIntent)
                            launched = true
                        } catch (e: Exception) {
                            launched = false
                        }
                    }

                    result.success(launched)
                }

                "isAppInstalled" -> {
                    val packageName = call.argument<String>("packageName") ?: ""
                    val candidatesList = call.argument<List<String>>("packageCandidates") ?: emptyList()
                    val allPackages = if (candidatesList.isNotEmpty()) candidatesList else listOfNotNull(packageName.ifEmpty { null })
                    
                    var isInstalled = false

                    for (pkg in allPackages) {
                        if (pkg.isBlank()) continue
                        try {
                            packageManager.getPackageInfo(pkg, 0)
                            isInstalled = true
                            break
                        } catch (e: PackageManager.NameNotFoundException) {
                            // Try launch intent check
                            try {
                                if (packageManager.getLaunchIntentForPackage(pkg) != null) {
                                    isInstalled = true
                                    break
                                }
                            } catch (e2: Exception) {}
                        } catch (e: Exception) {
                            try {
                                if (packageManager.getLaunchIntentForPackage(pkg) != null) {
                                    isInstalled = true
                                    break
                                }
                            } catch (e2: Exception) {}
                        }
                    }
                    result.success(isInstalled)
                }

                "getCurrentLocation" -> {
                    if (hasLocationPermission()) {
                        fetchExactLocation(result)
                    } else {
                        pendingLocationResult = result
                        ActivityCompat.requestPermissions(
                            this,
                            arrayOf(
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION
                            ),
                            LOCATION_PERMISSION_REQUEST_CODE
                        )
                    }
                }

                else -> result.notImplemented()
            }
        }
    }

    private fun hasLocationPermission(): Boolean {
        return ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED || ContextCompat.checkSelfPermission(
            this,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun fetchExactLocation(result: MethodChannel.Result) {
        val locationManager = getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        if (locationManager == null) {
            result.success(null)
            return
        }

        // Try getting last known location first (fast response)
        var bestLocation: Location? = null
        try {
            if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                bestLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
            }
            if (bestLocation == null && locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                bestLocation = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
            }
        } catch (e: SecurityException) {
            // Ignored
        }

        if (bestLocation != null) {
            val resultMap = mapOf(
                "lat" to bestLocation.latitude,
                "lon" to bestLocation.longitude,
                "accuracy" to bestLocation.accuracy
            )
            result.success(resultMap)
            return
        }

        // If last known not found, request a single update
        try {
            val listener = object : LocationListener {
                override fun onLocationChanged(location: Location) {
                    locationManager.removeUpdates(this)
                    val resultMap = mapOf(
                        "lat" to location.latitude,
                        "lon" to location.longitude,
                        "accuracy" to location.accuracy
                    )
                    result.success(resultMap)
                }
                override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                override fun onProviderEnabled(provider: String) {}
                override fun onProviderDisabled(provider: String) {}
            }

            val provider = if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                LocationManager.GPS_PROVIDER
            } else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                LocationManager.NETWORK_PROVIDER
            } else {
                null
            }

            if (provider != null) {
                locationManager.requestSingleUpdate(provider, listener, Looper.getMainLooper())
                Handler(Looper.getMainLooper()).postDelayed({
                    locationManager.removeUpdates(listener)
                }, 6000)
            } else {
                result.success(null)
            }
        } catch (e: SecurityException) {
            result.success(null)
        } catch (e: Exception) {
            result.success(null)
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            val res = pendingLocationResult
            pendingLocationResult = null
            if (res != null) {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    fetchExactLocation(res)
                } else {
                    res.success(null)
                }
            }
        }
    }
}
