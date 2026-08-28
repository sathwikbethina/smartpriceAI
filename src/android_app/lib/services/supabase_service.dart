import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class SupabaseService {
  static const String supabaseUrl = 'https://xwcmwqzgmbsvxetwskcb.supabase.co';
  static const String anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y213cXpnbWJzdnhldHdza2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjE5NjcsImV4cCI6MjEwMTU5Nzk2N30.7RHY4e88DNQAZrMu4hAXXauMicK8lLf_CKCpL9teLUE';

  static Map<String, String> get _headers => {
    'apikey': anonKey,
    'Authorization': 'Bearer $anonKey',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };

  /// Converts any custom user string ID to a valid RFC 4122 UUID format
  static String _toValidUuid(String? userId) {
    if (userId == null || userId.isEmpty || userId.startsWith('guest')) {
      return 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    }
    // If it's already a valid 36-char UUID
    final uuidRegex = RegExp(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', caseSensitive: false);
    if (uuidRegex.hasMatch(userId)) {
      return userId;
    }
    // Deterministic UUID conversion
    final clean = userId.replaceAll(RegExp(r'[^0-9a-fA-F]'), '').padRight(32, '0').substring(0, 32);
    return '${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20, 32)}';
  }

  /// Sync watchlist addition to Supabase
  static Future<bool> addToWatchlist(Product product, {String? userId}) async {
    try {
      final validUuid = _toValidUuid(userId);
      final body = jsonEncode({
        'user_id': validUuid,
        'product_name': product.name,
        'product_image': product.image,
        'platform': product.platform,
        'current_price': product.price,
        'target_price': product.price * 0.9,
        'product_url': product.url,
        'category': product.category.isNotEmpty ? product.category : 'General',
        'is_notified': false,
      });

      final response = await http.post(
        Uri.parse('$supabaseUrl/rest/v1/watchlist'),
        headers: _headers,
        body: body,
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        debugPrint('✅ Supabase: Successfully added "${product.name}" to watchlist');
        return true;
      } else {
        debugPrint('⚠️ Supabase Watchlist Note: ${response.statusCode} - ${response.body}');
        return false;
      }
    } catch (e) {
      debugPrint('⚠️ Supabase Watchlist Exception: $e');
      return false;
    }
  }

  /// Sync watchlist removal to Supabase
  static Future<bool> removeFromWatchlist(Product product, {String? userId}) async {
    try {
      final validUuid = _toValidUuid(userId);
      final encodedName = Uri.encodeComponent(product.name);
      final encodedPlatform = Uri.encodeComponent(product.platform);

      final response = await http.delete(
        Uri.parse('$supabaseUrl/rest/v1/watchlist?user_id=eq.$validUuid&product_name=eq.$encodedName&platform=eq.$encodedPlatform'),
        headers: _headers,
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      debugPrint('⚠️ Supabase Remove Watchlist Exception: $e');
      return false;
    }
  }

  /// Record search in Supabase
  static Future<void> recordSearch(String query, String city, int count, {String? userId}) async {
    try {
      final validUuid = _toValidUuid(userId);
      final body = jsonEncode({
        'user_id': validUuid,
        'query': query,
        'city': city,
        'result_count': count,
      });

      await http.post(
        Uri.parse('$supabaseUrl/rest/v1/searches'),
        headers: _headers,
        body: body,
      );
    } catch (e) {
      debugPrint('⚠️ Supabase Search Record Exception: $e');
    }
  }
}
