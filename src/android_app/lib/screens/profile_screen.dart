import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/location_pincode_sheet.dart';
import '../widgets/installed_apps_permission_sheet.dart';
import 'auth_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final user = provider.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Account & Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // User Profile Hero Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
                ),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: AppTheme.primary.withValues(alpha: 0.15),
                    backgroundImage: user?.avatarUrl != null ? NetworkImage(user!.avatarUrl) : null,
                    child: user?.avatarUrl == null
                        ? const Icon(Icons.person_rounded, color: AppTheme.primary, size: 32)
                        : null,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              user?.fullName ?? 'Guest Shopper',
                              style: const TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: (provider.isAuthenticated && !provider.isGuest)
                                    ? AppTheme.emerald.withValues(alpha: 0.15)
                                    : Colors.grey.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                (provider.isAuthenticated && !provider.isGuest) ? 'Verified' : 'Guest',
                                style: TextStyle(
                                  color: (provider.isAuthenticated && !provider.isGuest)
                                      ? AppTheme.emerald
                                      : Colors.grey,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          user?.email ?? 'guest@smartprice.ai',
                          style: TextStyle(
                            fontSize: 12,
                            color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '📍 ${provider.currentCity} (${provider.currentPincode})',
                          style: const TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Settings Group
            Container(
              decoration: BoxDecoration(
                color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
                ),
              ),
              child: Column(
                children: [
                  // Dark Mode Switch
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        provider.isDarkMode ? Icons.dark_mode_rounded : Icons.light_mode_rounded,
                        color: AppTheme.primary,
                        size: 20,
                      ),
                    ),
                    title: const Text('Dark Mode', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    trailing: Switch(
                      value: provider.isDarkMode,
                      onChanged: (_) => provider.toggleTheme(),
                      activeThumbColor: AppTheme.primary,
                    ),
                  ),
                  Divider(height: 1, color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),

                  // Delivery Location
                  ListTile(
                    onTap: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (_) => const LocationPincodeSheet(),
                      );
                    },
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.location_on_rounded, color: AppTheme.accent, size: 20),
                    ),
                    title: const Text('Delivery Location', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: Text('${provider.currentArea}, ${provider.currentCity} (${provider.currentPincode})', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                  ),
                  Divider(height: 1, color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),

                  // Installed Apps & Direct Deep Links
                  ListTile(
                    onTap: () {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (_) => const InstalledAppsPermissionSheet(),
                      );
                    },
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3B82F6).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.install_mobile_rounded, color: Color(0xFF3B82F6), size: 20),
                    ),
                    title: const Text('Installed Shopping Apps', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: const Text('Amazon, Blinkit, Zepto, Flipkart, 1mg, PharmEasy', style: TextStyle(fontSize: 11, color: Colors.grey)),
                    trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
                  ),
                  Divider(height: 1, color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),

                  // Watchlist Shortcut
                  ListTile(
                    onTap: () => provider.setActiveTab(2),
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.emerald.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.bookmark_rounded, color: AppTheme.emerald, size: 20),
                    ),
                    title: const Text('Saved Watchlist', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    trailing: Text(
                      '${provider.watchlist.length} items',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ),
                  Divider(height: 1, color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),

                  // Search History Shortcut
                  ListTile(
                    onTap: () => provider.setActiveTab(3),
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF8B5CF6).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.history_rounded, color: Color(0xFF8B5CF6), size: 20),
                    ),
                    title: const Text('Search History', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    trailing: Text(
                      '${provider.searches.length} searches',
                      style: const TextStyle(fontSize: 12, color: Colors.grey),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Sign In or Logout CTA
            if (!provider.isAuthenticated || provider.isGuest) ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AuthScreen()),
                    );
                  },
                  icon: const Icon(Icons.login_rounded, size: 18),
                  label: const Text('Sign In / Create Account'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () => provider.loginWithGoogle(),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                    side: BorderSide(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 20,
                        height: 20,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                        ),
                        child: const Center(
                          child: Text(
                            'G',
                            style: TextStyle(
                              color: Color(0xFF4285F4),
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'Continue with Google',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ]
            else
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Sign Out'),
                        content: const Text('Are you sure you want to sign out of this account?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx),
                            child: const Text('Cancel'),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              provider.logout();
                              Navigator.pop(ctx);
                            },
                            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.rose),
                            child: const Text('Sign Out'),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.logout_rounded, color: AppTheme.rose, size: 18),
                  label: const Text('Sign Out', style: TextStyle(color: AppTheme.rose, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.rose),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
