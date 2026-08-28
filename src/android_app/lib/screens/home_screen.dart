import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/location_pincode_sheet.dart';
import 'search_results_screen.dart';
import 'watchlist_screen.dart';
import 'history_screen.dart';
import 'profile_screen.dart';
import 'auth_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();

  void _performSearch(String query) {
    final q = query.trim();
    if (q.isEmpty) return;
    Provider.of<AppProvider>(context, listen: false).search(q);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => SearchResultsScreen(query: q),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    final pages = [
      _buildHomeTab(context, provider),
      SearchResultsScreen(query: provider.currentQuery.isNotEmpty ? provider.currentQuery : 'iPhone 15'),
      const WatchlistScreen(),
      const HistoryScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: provider.activeTabIndex,
        children: pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: provider.activeTabIndex,
        onTap: (idx) {
          if (idx == 1 && provider.currentQuery.isEmpty) {
            _performSearch('iPhone 15');
          }
          provider.setActiveTab(idx);
        },
        type: BottomNavigationBarType.fixed,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_rounded),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search_rounded),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bookmark_rounded),
            label: 'Watchlist',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history_rounded),
            label: 'History',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_rounded),
            label: 'Account',
          ),
        ],
      ),
    );
  }

  Widget _buildHomeTab(BuildContext context, AppProvider provider) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppTheme.accent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            const Text(
              'SmartPrice AI',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(provider.isDarkMode ? Icons.light_mode_rounded : Icons.dark_mode_rounded),
            onPressed: () => provider.toggleTheme(),
            tooltip: 'Toggle Theme',
          ),
          if (!provider.isAuthenticated || provider.isGuest)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const AuthScreen()),
                  );
                },
                icon: const Icon(Icons.login_rounded, size: 16),
                label: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Location Bar Pill
            GestureDetector(
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (_) => const LocationPincodeSheet(),
                );
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.location_on_rounded, color: AppTheme.accent, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Delivering to ${provider.currentArea}, ${provider.currentCity} (${provider.currentPincode})',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                    ),
                    const Icon(Icons.arrow_drop_down_rounded, color: Colors.grey),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Hero Header
            const Text(
              'Compare Store Prices Live',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 4),
            Text(
              'Blinkit • Zepto • BigBasket • Amazon • Flipkart • 1mg • PharmEasy',
              style: TextStyle(
                fontSize: 12,
                color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
              ),
            ),
            const SizedBox(height: 18),

            // Search Bar
            TextField(
              controller: _searchController,
              onSubmitted: _performSearch,
              decoration: InputDecoration(
                hintText: 'Search Colgate, Cetirizine, Ariel 300g, Condoms...',
                prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primary),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.arrow_forward_rounded, color: AppTheme.primary),
                  onPressed: () => _performSearch(_searchController.text),
                ),
                filled: true,
                fillColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCardSubtle,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(20),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
            const SizedBox(height: 24),

            // Popular Categories
            const Text(
              'Popular Categories',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildCategoryChip('Grocery & Daily', Icons.shopping_basket_rounded, () => _performSearch('Colgate')),
                _buildCategoryChip('Medicines', Icons.medication_rounded, () => _performSearch('Cetirizine')),
                _buildCategoryChip('Cleaning', Icons.cleaning_services_rounded, () => _performSearch('Ariel Liquid Detergent 300g')),
                _buildCategoryChip('Personal Care', Icons.health_and_safety_rounded, () => _performSearch('Condoms')),
                _buildCategoryChip('Electronics', Icons.phone_iphone_rounded, () => _performSearch('iPhone 15')),
              ],
            ),
            const SizedBox(height: 28),

            // Recent Searches for this user
            if (provider.searches.isNotEmpty) ...[
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Your Recent Searches',
                    style: TextStyle(fontSize: 15, fontWeight: FontWeight.w900),
                  ),
                  GestureDetector(
                    onTap: () => provider.setActiveTab(3),
                    child: const Text(
                      'View All',
                      style: TextStyle(color: AppTheme.primary, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              ...provider.searches.take(4).map((s) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    tileColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                    leading: const Icon(Icons.history_rounded, size: 18, color: Colors.grey),
                    title: Text(s.query, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: Text('${s.resultCount} stores compared', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                    trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: Colors.grey),
                    onTap: () => _performSearch(s.query),
                  ),
                );
              }),
            ],
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppTheme.primary.withValues(alpha: 0.25)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: AppTheme.primary, size: 16),
            const SizedBox(width: 6),
            Text(
              label,
              style: const TextStyle(
                color: AppTheme.primary,
                fontWeight: FontWeight.bold,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
