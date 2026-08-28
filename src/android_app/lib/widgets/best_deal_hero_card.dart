import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import 'app_redirect_sheet.dart';

class BestDealHeroCard extends StatelessWidget {
  final Product product;

  const BestDealHeroCard({super.key, required this.product});

  void _onBuyNow(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => AppRedirectSheet(product: product),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);
    final isSaved = provider.isInWatchlist(product);
    final savings = product.mrp > product.price ? product.mrp - product.price : 0.0;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.emerald, width: 2.0),
        boxShadow: [
          BoxShadow(
            color: AppTheme.emerald.withValues(alpha: 0.15),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(22),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => _onBuyNow(context),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Green Ribbon
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  color: AppTheme.emerald,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.bolt_rounded, color: Colors.white, size: 18),
                            SizedBox(width: 6),
                            Flexible(
                              child: Text(
                                'LOWEST PRICE IN INDIA FOUND',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 11,
                                  letterSpacing: 0.5,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        product.platform,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),

                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Product Image
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 84,
                              height: 84,
                              color: provider.isDarkMode ? AppTheme.darkCardSubtle : AppTheme.lightCardSubtle,
                              child: Image.network(
                                product.image,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Center(
                                  child: Icon(
                                    Icons.shopping_bag_outlined,
                                    size: 36,
                                    color: provider.isDarkMode ? Colors.grey.shade600 : Colors.grey.shade400,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),

                          // Product Info
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: AppTheme.primary.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        product.platform,
                                        style: const TextStyle(
                                          color: AppTheme.primary,
                                          fontWeight: FontWeight.w900,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    if (product.inStock)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: AppTheme.emerald.withValues(alpha: 0.15),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: const Text(
                                          '✓ In Stock',
                                          style: TextStyle(
                                            color: AppTheme.emerald,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 10,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  product.name,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 14,
                                    color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '⚡ ${product.delivery}',
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
                      const SizedBox(height: 14),

                      // Price Row
                      Wrap(
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: 8,
                        runSpacing: 4,
                        children: [
                          Text(
                            '₹${product.price.toStringAsFixed(product.price % 1 == 0 ? 0 : 2)}',
                            style: const TextStyle(
                              color: AppTheme.emerald,
                              fontWeight: FontWeight.w900,
                              fontSize: 24,
                            ),
                          ),
                          if (product.mrp > product.price) ...[
                            Text(
                              '₹${product.mrp.toStringAsFixed(product.mrp % 1 == 0 ? 0 : 2)}',
                              style: TextStyle(
                                decoration: TextDecoration.lineThrough,
                                color: Colors.grey.shade500,
                                fontSize: 13,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppTheme.emerald.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'Save ${product.discountPercentage}% (₹${savings.toStringAsFixed(0)})',
                                style: const TextStyle(
                                  color: AppTheme.emerald,
                                  fontWeight: FontWeight.w900,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 14),

                      // Actions Row
                      Row(
                        children: [
                          IconButton.filledTonal(
                            onPressed: () => provider.toggleWatchlist(product),
                            icon: Icon(
                              isSaved ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                              color: isSaved ? AppTheme.accent : null,
                            ),
                            style: IconButton.styleFrom(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => _onBuyNow(context),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.emerald,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Flexible(
                                    child: Text(
                                      product.isDirect ? 'Buy Now on ${product.platform}' : 'Search on ${product.platform}',
                                      style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(Icons.arrow_forward_rounded, size: 16),
                                ],
                              ),
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
        ),
      ),
    );
  }
}
