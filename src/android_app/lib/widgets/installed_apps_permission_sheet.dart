import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class InstalledAppsPermissionSheet extends StatefulWidget {
  const InstalledAppsPermissionSheet({super.key});

  @override
  State<InstalledAppsPermissionSheet> createState() => _InstalledAppsPermissionSheetState();
}

class _InstalledAppsPermissionSheetState extends State<InstalledAppsPermissionSheet> {
  final List<Map<String, dynamic>> _supportedApps = [
    {
      'name': 'Amazon India',
      'package': 'com.amazon.mShop.android.shopping',
      'category': 'E-Commerce',
      'icon': Icons.shopping_cart_rounded,
      'color': const Color(0xFFFF9900),
    },
    {
      'name': 'Flipkart',
      'package': 'com.flipkart.android',
      'category': 'E-Commerce',
      'icon': Icons.shopping_bag_rounded,
      'color': const Color(0xFF2874F0),
    },
    {
      'name': 'Blinkit',
      'package': 'com.grofers.customerapp',
      'category': '10-Min Delivery',
      'icon': Icons.bolt_rounded,
      'color': const Color(0xFFF7C200),
    },
    {
      'name': 'Zepto',
      'package': 'com.zepto.consumer',
      'category': '10-Min Delivery',
      'icon': Icons.timer_rounded,
      'color': const Color(0xFF7B1FA2),
    },
    {
      'name': 'Tata 1mg',
      'package': 'com.aranoah.healthkart.plus',
      'category': 'Pharmacy',
      'icon': Icons.medication_rounded,
      'color': const Color(0xFFFF6F61),
    },
    {
      'name': 'PharmEasy',
      'package': 'com.mruniversal.pharmeasy',
      'category': 'Pharmacy',
      'icon': Icons.local_pharmacy_rounded,
      'color': const Color(0xFF10847E),
    },
    {
      'name': 'Apollo 24|7',
      'package': 'com.apollo.patientapp',
      'category': 'Pharmacy',
      'icon': Icons.health_and_safety_rounded,
      'color': const Color(0xFF005696),
    },
    {
      'name': 'BigBasket',
      'package': 'com.bigbasket.mobileapp',
      'category': 'Groceries',
      'icon': Icons.eco_rounded,
      'color': const Color(0xFF84B741),
    },
  ];

  late Set<String> _enabledApps;

  @override
  void initState() {
    super.initState();
    _enabledApps = _supportedApps.map((a) => a['name'] as String).toSet();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

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
                  color: AppTheme.primary.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Center(
                  child: Icon(Icons.install_mobile_rounded, color: AppTheme.primary, size: 24),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Installed Apps & Direct Links',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 16,
                        color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Allow SmartPrice AI to open installed apps on your device',
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
          const SizedBox(height: 16),

          // Info Banner
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.08),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.primary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline_rounded, color: AppTheme.primary, size: 18),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'When enabled, tapping "Buy Now" directs straight to your installed store app. If not installed, it automatically opens in Chrome.',
                    style: TextStyle(
                      fontSize: 11,
                      color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                      height: 1.3,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // App Toggles List
          Flexible(
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: _supportedApps.length,
              itemBuilder: (context, index) {
                final app = _supportedApps[index];
                final isEnabled = _enabledApps.contains(app['name']);

                return SwitchListTile(
                  value: isEnabled,
                  onChanged: (val) {
                    setState(() {
                      if (val) {
                        _enabledApps.add(app['name']);
                      } else {
                        _enabledApps.remove(app['name']);
                      }
                    });
                  },
                  secondary: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: (app['color'] as Color).withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(app['icon'] as IconData, color: app['color'] as Color, size: 20),
                  ),
                  title: Text(
                    app['name'] as String,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                    ),
                  ),
                  subtitle: Text(
                    app['category'] as String,
                    style: const TextStyle(fontSize: 11, color: Colors.grey),
                  ),
                  activeThumbColor: AppTheme.emerald,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                );
              },
            ),
          ),
          const SizedBox(height: 16),

          // Save CTA
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('App permissions saved! Direct app linking is active.'),
                    backgroundColor: AppTheme.emerald,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: const Text('Save Preferences', style: TextStyle(fontWeight: FontWeight.w900)),
            ),
          ),
        ],
      ),
    );
  }
}
