import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

class UrlLauncherHelper {
  static const MethodChannel _channel = MethodChannel('com.example.smartprice_ai/app_launcher');

  /// Returns all known Android package name variants for Indian shopping and pharmacy apps
  static List<String> getPackageCandidatesForPlatform(String platform) {
    final p = platform.toLowerCase();
    if (p.contains('amazon')) {
      return ['in.amazon.mShop.android.shopping', 'com.amazon.mShop.android.shopping'];
    }
    if (p.contains('flipkart')) {
      return ['com.flipkart.android'];
    }
    if (p.contains('blinkit') || p.contains('grofers')) {
      return ['com.grofers.customerapp', 'com.blinkit.app'];
    }
    if (p.contains('zepto')) {
      return ['com.zepto.consumer', 'com.zeptonow'];
    }
    if (p.contains('1mg') || p.contains('tata')) {
      return ['com.aranoah.healthkart.plus', 'com.tata1mg.app'];
    }
    if (p.contains('pharmeasy')) {
      return ['com.mruniversal.pharmeasy'];
    }
    if (p.contains('bigbasket')) {
      return ['com.bigbasket.mobileapp'];
    }
    if (p.contains('apollo')) {
      return ['com.apollo.patientapp'];
    }
    if (p.contains('netmeds')) {
      return ['com.netmeds.marketplace'];
    }
    if (p.contains('jiomart')) {
      return ['com.jio.jiomart'];
    }
    if (p.contains('croma')) {
      return ['com.croma.app'];
    }
    if (p.contains('reliance')) {
      return ['com.reliancedigital.store'];
    }
    return [];
  }

  static String getPrimaryPackageForPlatform(String platform) {
    final list = getPackageCandidatesForPlatform(platform);
    return list.isNotEmpty ? list.first : '';
  }

  /// Check if the store app is installed on the user's Android phone
  static Future<bool> isAppInstalled(String platform) async {
    try {
      final candidates = getPackageCandidatesForPlatform(platform);
      if (candidates.isEmpty) return false;
      final bool? isInstalled = await _channel.invokeMethod<bool>('isAppInstalled', {
        'packageName': candidates.first,
        'packageCandidates': candidates,
      });
      return isInstalled ?? false;
    } catch (_) {
      return false;
    }
  }

  /// Open Google Play Store listing to download the app if not installed
  static Future<bool> openPlayStore(String platform) async {
    final pkg = getPrimaryPackageForPlatform(platform);
    if (pkg.isEmpty) return false;
    try {
      final marketUri = Uri.parse('market://details?id=$pkg');
      final launched = await launchUrl(marketUri, mode: LaunchMode.externalApplication);
      if (launched) return true;
    } catch (_) {}
    try {
      final webPlayStoreUri = Uri.parse('https://play.google.com/store/apps/details?id=$pkg');
      return await launchUrl(webPlayStoreUri, mode: LaunchMode.externalApplication);
    } catch (_) {
      return false;
    }
  }

  /// Opens direct product link:
  /// 1. Tries native Intent with candidate packages to jump directly into installed app
  /// 2. If app is not installed or direct launch fails, seamlessly opens in Google Chrome / Browser
  static Future<bool> openStoreProduct({
    required String url,
    String platform = '',
    String productName = '',
  }) async {
    if (url.trim().isEmpty) return false;

    final String cleanUrl = url.trim();
    final List<String> candidates = getPackageCandidatesForPlatform(platform);

    debugPrint('UrlLauncherHelper: Launching $cleanUrl (Candidates: $candidates, Platform: $platform)');

    // 1. Try Native Android Intent with candidate packages (Bypasses browser interception)
    try {
      final bool? launched = await _channel.invokeMethod<bool>('launchNativeApp', {
        'url': cleanUrl,
        'packageName': candidates.isNotEmpty ? candidates.first : '',
        'packageCandidates': candidates,
        'platform': platform,
      });
      if (launched == true) {
        debugPrint('UrlLauncherHelper: Successfully launched via native Intent');
        return true;
      }
    } catch (e) {
      debugPrint('UrlLauncherHelper: Native MethodChannel failed ($e), falling back to url_launcher');
    }

    // 2. Fallback: url_launcher external application
    try {
      final uri = Uri.parse(cleanUrl);
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.externalApplication,
      );
      if (launched) return true;
    } catch (_) {}

    // 3. Fallback: url_launcher platform default (Chrome)
    try {
      final uri = Uri.parse(cleanUrl);
      final launched = await launchUrl(
        uri,
        mode: LaunchMode.platformDefault,
      );
      return launched;
    } catch (_) {
      return false;
    }
  }
}
