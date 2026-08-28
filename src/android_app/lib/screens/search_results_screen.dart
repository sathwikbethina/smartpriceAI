import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/best_deal_hero_card.dart';
import '../widgets/store_comparison_card.dart';
import '../widgets/ai_alternatives_section.dart';
import '../widgets/location_pincode_sheet.dart';
import '../theme/app_theme.dart';

class SearchResultsScreen extends StatefulWidget {
  final String query;

  const SearchResultsScreen({super.key, required this.query});

  @override
  State<SearchResultsScreen> createState() => _SearchResultsScreenState();
}

class _SearchResultsScreenState extends State<SearchResultsScreen> {
  late TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.query);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchSubmit(String val) {
    if (val.trim().isEmpty) return;
    Provider.of<AppProvider>(context, listen: false).search(val.trim());
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    if (provider.currentQuery.isNotEmpty && _searchController.text != provider.currentQuery && !_searchController.selection.isValid) {
      _searchController.text = provider.currentQuery;
    }
    final processed = provider.processedProducts;
    final bestDeal = provider.bestDeal;
    final lowestPrice = bestDeal?.price ?? 0.0;

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Padding(
          padding: const EdgeInsets.only(right: 16),
          child: TextField(
            controller: _searchController,
            onSubmitted: _onSearchSubmit,
            decoration: InputDecoration(
              hintText: 'Search product (e.g. iPhone 15, Colgate)...',
              prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primary, size: 20),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded, size: 18),
                      onPressed: () {
                        _searchController.clear();
                      },
                    )
                  : null,
              filled: true,
              fillColor: provider.isDarkMode ? AppTheme.darkCardSubtle : AppTheme.lightCardSubtle,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Filter Chips Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All Stores', 'all', provider),
                  const SizedBox(width: 8),
                  _buildFilterChip('⚡ 10-15 Min', 'fastest', provider),
                  const SizedBox(width: 8),
                  _buildFilterChip('Lowest Price', 'lowest', provider),
                  const SizedBox(width: 8),
                  _buildFilterChip('In Stock Only', 'instock', provider),
                  if (provider.availableStores.length > 1) ...[
                    const SizedBox(width: 12),
                    Container(height: 20, width: 1, color: Colors.grey.shade400),
                    const SizedBox(width: 12),
                    ...provider.availableStores.map((store) {
                      final isSelected = provider.selectedStores.contains(store);
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(store, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
                          selected: isSelected,
                          onSelected: (_) => provider.toggleStoreFilter(store),
                          selectedColor: AppTheme.primary.withValues(alpha: 0.2),
                          checkmarkColor: AppTheme.primary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      );
                    }),
                  ],
                ],
              ),
            ),
          ),

          // Location Banner Pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: provider.isDarkMode ? AppTheme.darkBg : AppTheme.lightBg,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${processed.length} stores compared',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      builder: (_) => const LocationPincodeSheet(),
                    );
                  },
                  child: Row(
                    children: [
                      const Icon(Icons.location_on_rounded, color: AppTheme.primary, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        '${provider.currentCity} (${provider.currentPincode})',
                        style: const TextStyle(
                          color: AppTheme.primary,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Main Results Body
          Expanded(
            child: provider.isLoading
                ? const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(color: AppTheme.primary),
                        SizedBox(height: 16),
                        Text(
                          'Scanning Blinkit, Zepto, BigBasket, Amazon, Flipkart, 1mg...',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  )
                : provider.errorMessage.isNotEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.error_outline_rounded, color: AppTheme.rose, size: 48),
                              const SizedBox(height: 16),
                              Text(
                                provider.errorMessage,
                                textAlign: TextAlign.center,
                                style: const TextStyle(fontSize: 14),
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: () => provider.search(_searchController.text),
                                style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
                                child: const Text('Retry Search', style: TextStyle(color: Colors.white)),
                              ),
                            ],
                          ),
                        ),
                      )
                    : processed.isEmpty
                        ? Center(
                            child: Padding(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.search_off_rounded, size: 56, color: Colors.grey),
                                  const SizedBox(height: 16),
                                  Text(
                                    'No direct seller listings found for "${_searchController.text}"',
                                    textAlign: TextAlign.center,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Try another brand or check AI substitutes below.',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(fontSize: 12, color: Colors.grey),
                                  ),
                                  if (provider.alternatives.isNotEmpty)
                                    AIAlternativesSection(
                                      alternatives: provider.alternatives,
                                      originalQuery: _searchController.text,
                                      isLoading: provider.isLoadingAi,
                                    ),
                                ],
                              ),
                            ),
                          )
                        : ListView(
                            padding: const EdgeInsets.all(16),
                            children: [
                              // Hero Best Deal Card
                              if (bestDeal != null)
                                BestDealHeroCard(product: bestDeal),

                                // Store Price Comparison Header
                                Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Text(
                                          'Compare ${processed.length} Available Prices',
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
                                ),
                              const SizedBox(height: 8),

                              // Store Comparison Cards
                              ...processed.asMap().entries.map((entry) {
                                final idx = entry.key;
                                final item = entry.value;
                                return StoreComparisonCard(
                                  product: item,
                                  isCheapest: idx == 0,
                                  lowestPrice: lowestPrice,
                                );
                              }),

                              // Gemini AI Alternatives Section
                              AIAlternativesSection(
                                alternatives: provider.alternatives,
                                originalQuery: _searchController.text,
                                isLoading: provider.isLoadingAi,
                              ),
                            ],
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String filterKey, AppProvider provider) {
    final isSelected = provider.activeFilter == filterKey;
    return ChoiceChip(
      label: Text(label, style: TextStyle(fontSize: 11, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
      selected: isSelected,
      onSelected: (_) => provider.setFilter(filterKey),
      selectedColor: filterKey == 'fastest'
          ? AppTheme.accent.withValues(alpha: 0.2)
          : filterKey == 'lowest'
              ? AppTheme.emerald.withValues(alpha: 0.2)
              : AppTheme.primary.withValues(alpha: 0.2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}
