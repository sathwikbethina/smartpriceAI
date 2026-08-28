import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ApiService {
  static const MethodChannel _nativeChannel = MethodChannel('com.example.smartprice_ai/app_launcher');

  // Candidate endpoints for local development:
  // 1. localhost:3000 (when USB connected with adb reverse)
  // 2. 10.175.54.85:3000 (PC's Wi-Fi LAN IP when on same network)
  // 3. 10.0.2.2:3000 (Android Studio Emulator loopback)
  static final List<String> _candidateUrls = [
    'http://localhost:3000',
    'http://10.175.54.85:3000',
    'http://10.0.2.2:3000',
  ];

  static String _activeBaseUrl = 'http://localhost:3000';

  static Future<http.Response> _postWithFallback(
    String endpoint,
    Map<String, dynamic> body,
  ) async {
    // Try currently active base URL first
    try {
      final uri = Uri.parse('$_activeBaseUrl$endpoint');
      final res = await http
          .post(
            uri,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 4));
      return res;
    } catch (_) {
      // Try other candidates if active fails
      for (final candidate in _candidateUrls) {
        if (candidate == _activeBaseUrl) continue;
        try {
          final uri = Uri.parse('$candidate$endpoint');
          final res = await http
              .post(
                uri,
                headers: {'Content-Type': 'application/json'},
                body: jsonEncode(body),
              )
              .timeout(const Duration(seconds: 4));
          _activeBaseUrl = candidate;
          debugPrint('ApiService: switched active endpoint to $candidate');
          return res;
        } catch (_) {
          continue;
        }
      }
      rethrow;
    }
  }

  static Future<http.Response> _getWithFallback(String endpoint) async {
    try {
      final uri = Uri.parse('$_activeBaseUrl$endpoint');
      final res = await http.get(uri).timeout(const Duration(seconds: 4));
      return res;
    } catch (_) {
      for (final candidate in _candidateUrls) {
        if (candidate == _activeBaseUrl) continue;
        try {
          final uri = Uri.parse('$candidate$endpoint');
          final res = await http.get(uri).timeout(const Duration(seconds: 4));
          _activeBaseUrl = candidate;
          return res;
        } catch (_) {
          continue;
        }
      }
      rethrow;
    }
  }

  static Future<List<Product>> searchProducts(String query, {String city = 'Chennai'}) async {
    try {
      final response = await _postWithFallback('/api/search', {
        'query': query,
        'city': city,
      });

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> productsJson = data['products'] ?? [];
        return productsJson.map((json) => Product.fromJson(json as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Failed to load comparison data: ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('API Error: $e');
      rethrow;
    }
  }

  static Future<List<AIAlternative>> fetchAlternatives(String query, {String category = 'general'}) async {
    try {
      final response = await _postWithFallback('/api/ai-alternatives', {
        'productName': query,
        'category': category,
      });

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = jsonDecode(response.body);
        final List<dynamic> altsJson = data['alternatives'] ?? [];
        return altsJson.map((json) => AIAlternative.fromJson(json as Map<String, dynamic>)).toList();
      }
      return [];
    } catch (e) {
      debugPrint('Alternatives API Error: $e');
      return [];
    }
  }

  // --- PUBLIC-APIS SUITE & EXACT GPS LOCATION ---

  /// 1. Fetch exact GPS latitude and longitude from device
  static Future<Map<String, dynamic>?> getCurrentGpsCoordinates() async {
    try {
      final res = await _nativeChannel.invokeMethod<Map>('getCurrentLocation');
      if (res != null) {
        return Map<String, dynamic>.from(res);
      }
    } catch (e) {
      debugPrint('Error getting GPS coordinates: $e');
    }
    return null;
  }

  /// 2. Reverse Geocode GPS coordinates to exact Indian Area, City, Pincode via OpenStreetMap Nominatim
  static Future<Map<String, dynamic>?> reverseGeocode(double lat, double lon) async {
    try {
      final res = await _getWithFallback('/api/geo/reverse?lat=$lat&lon=$lon');
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('Reverse Geocode error: $e');
    }
    return null;
  }

  /// 3. OpenFDA Clinical Medicine Details
  static Future<Map<String, dynamic>?> lookupMedicineClinical(String medicineName) async {
    try {
      final res = await _postWithFallback('/api/fda/lookup', {'medicineName': medicineName});
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('FDA Lookup error: $e');
    }
    return null;
  }

  /// 4. OpenStreetMap Nominatim Live Geocoding for Indian Pincodes
  static Future<Map<String, dynamic>?> lookupPincodeGeo(String pincode) async {
    try {
      final res = await _getWithFallback('/api/geo/pincode?pincode=$pincode');
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('Geo Lookup error: $e');
    }
    return null;
  }

  /// 5. Open Food Facts Verified Grocery Lookup
  static Future<Map<String, dynamic>?> lookupFoodProduct(String query) async {
    try {
      final res = await _postWithFallback('/api/food/lookup', {'query': query});
      if (res.statusCode == 200) {
        return jsonDecode(res.body) as Map<String, dynamic>;
      }
    } catch (e) {
      debugPrint('Food Lookup error: $e');
    }
    return null;
  }
}
