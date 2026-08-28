import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/app_provider.dart';
import '../services/url_launcher_helper.dart';
import '../theme/app_theme.dart';

class AppRedirectSheet extends StatefulWidget {
  final Product product;

  const AppRedirectSheet({super.key, required this.product});

  @override
  State<AppRedirectSheet> createState() => _AppRedirectSheetState();
}

class _AppRedirectSheetState extends State<AppRedirectSheet> {
  bool _isInstalled = false;
  bool _isChecking = true;

  @override
  void initState() {
    super.initState();
    _checkAppInstallation();
  }

  void _checkAppInstallation() async {
    final installed = await UrlLauncherHelper.isAppInstalled(widget.product.platform);
    if (mounted) {
      setState(() {
        _isInstalled = installed;
        _isChecking = false;
      });
    }
  }

  Color _getStoreColor(String platform) {
    final p = platform.toLowerCase();
    if (p.contains('amazon')) return const Color(0xFFFF9900);
    if (p.contains('flipkart')) return const Color(0xFF2874F0);
    if (p.contains('blinkit')) return const Color(0xFFF7C200);
    if (p.contains('zepto')) return const Color(0xFF7B1FA2);
    if (p.contains('bigbasket')) return const Color(0xFF84B741);
    if (p.contains('1mg') || p.contains('tata')) return const Color(0xFFFF6F61);
    if (p.contains('pharmeasy')) return const Color(0xFF10847E);
    if (p.contains('apollo')) return const Color(0xFF005696);
    if (p.contains('netmeds')) return const Color(0xFF24AEB1);
    return AppTheme.accent;
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final storeColor = _getStoreColor(widget.product.platform);

    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade400,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Header
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: storeColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(
                  child: Icon(Icons.shopping_bag_rounded, color: storeColor, size: 24),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            'Redirecting to ${widget.product.platform}',
                            style: TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 16,
                              color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    if (!_isChecking)
                      Row(
                        children: [
                          Icon(
                            _isInstalled ? Icons.check_circle_rounded : Icons.info_outline_rounded,
                            color: _isInstalled ? AppTheme.emerald : Colors.amber.shade700,
                            size: 13,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _isInstalled
                                ? 'App installed on your device ✓'
                                : 'App not installed on device',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: _isInstalled
                                  ? AppTheme.emerald
                                  : Colors.amber.shade700,
                            ),
                          ),
                        ],
                      )
                    else
                      Text(
                        'Checking installed apps...',
                        style: TextStyle(
                          fontSize: 11,
                          color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Product Summary Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: provider.isDarkMode ? AppTheme.darkCardSubtle : AppTheme.lightCardSubtle,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
              ),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    width: 50,
                    height: 50,
                    color: Colors.white,
                    child: Image.network(
                      widget.product.image,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Icon(Icons.inventory_2_outlined, color: Colors.grey.shade400),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.product.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(
                            '₹${widget.product.price.toStringAsFixed(widget.product.price % 1 == 0 ? 0 : 2)}',
                            style: const TextStyle(
                              color: AppTheme.emerald,
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '⚡ ${widget.product.delivery}',
                            style: TextStyle(
                              fontSize: 10,
                              color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Dynamic Action Buttons based on App Installation Status
          if (_isInstalled) ...[
            // 1. App is INSTALLED -> Primary: Open Native App
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  UrlLauncherHelper.openStoreProduct(
                    url: widget.product.url,
                    platform: widget.product.platform,
                    productName: widget.product.name,
                  );
                },
                icon: const Icon(Icons.phone_android_rounded, size: 20),
                label: Text(
                  widget.product.isDirect
                      ? 'Open in ${widget.product.platform} App'
                      : 'Search in ${widget.product.platform} App',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: storeColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Secondary: Open on Website
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  UrlLauncherHelper.openStoreProduct(
                    url: widget.product.url,
                    platform: '',
                    productName: widget.product.name,
                  );
                },
                icon: const Icon(Icons.language_rounded, size: 18),
                label: Text(
                  widget.product.isDirect
                      ? 'Open on ${widget.product.platform} Website (Chrome)'
                      : 'Search on ${widget.product.platform} Website (Chrome)',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(
                    color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ] else ...[
            // 2. App is NOT INSTALLED -> Primary: Open directly in Chrome Website
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  UrlLauncherHelper.openStoreProduct(
                    url: widget.product.url,
                    platform: '',
                    productName: widget.product.name,
                  );
                },
                icon: const Icon(Icons.language_rounded, size: 20),
                label: Text(
                  widget.product.isDirect
                      ? 'Buy on ${widget.product.platform} Website (Chrome)'
                      : 'Search on ${widget.product.platform} Website (Chrome)',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: storeColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Secondary: Get from Google Play Store
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  UrlLauncherHelper.openPlayStore(widget.product.platform);
                },
                icon: const Icon(Icons.download_rounded, size: 18),
                label: Text(
                  'Get ${widget.product.platform} on Play Store',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(
                    color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
          ],
          const SizedBox(height: 10),
        ],
      ),
    );
  }
}
