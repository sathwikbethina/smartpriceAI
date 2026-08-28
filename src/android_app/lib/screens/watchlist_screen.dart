import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/store_comparison_card.dart';
import '../theme/app_theme.dart';

class WatchlistScreen extends StatelessWidget {
  const WatchlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Watchlist & Saved Deals'),
      ),
      body: provider.watchlist.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppTheme.accent.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.bookmark_border_rounded,
                        size: 56,
                        color: AppTheme.accent,
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Your Watchlist is Empty',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Tap the bookmark icon on any store deal to track prices and save items for this account.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13,
                        color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.watchlist.length,
              itemBuilder: (context, index) {
                final product = provider.watchlist[index];
                return StoreComparisonCard(product: product);
              },
            ),
    );
  }
}
