import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';
import 'app_redirect_sheet.dart';

class StoreComparisonCard extends StatelessWidget {
  final Product product;
  final bool isCheapest;
  final double lowestPrice;

  const StoreComparisonCard({
    super.key,
    required this.product,
    this.isCheapest = false,
    this.lowestPrice = 0.0,
  });

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
    final storeColor = _getStoreColor(product.platform);

    int higherPct = 0;
    if (lowestPrice > 0 && product.price > lowestPrice) {
      higherPct = (((product.price - lowestPrice) / lowestPrice) * 100).round();
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: isCheapest
            ? (provider.isDarkMode ? const Color(0xFF1E2838) : const Color(0xFFF0FDF4))
            : (provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isCheapest
              ? AppTheme.emerald.withValues(alpha: 0.5)
              : (provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),
          width: isCheapest ? 1.5 : 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _onBuyNow(context),
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                // Store Circular Avatar Badge
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: storeColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      product.platform.isNotEmpty ? product.platform.substring(0, 1) : 'S',
                      style: TextStyle(
                        color: storeColor,
                        fontWeight: FontWeight.w900,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 14),

                // Store Name & Delivery ETA
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              product.platform,
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                fontSize: 14,
                                color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (isCheapest) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.emerald.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                '⚡ Lowest',
                                style: TextStyle(
                                  color: AppTheme.emerald,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 3),
                      Text(
                        product.delivery.isNotEmpty ? product.delivery : 'Free delivery',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                // Price + % Higher Tag + Chevron
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '₹${product.price.toStringAsFixed(product.price % 1 == 0 ? 0 : 2)}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                      ),
                    ),
                    if (higherPct > 0)
                      Text(
                        '$higherPct% Higher',
                        style: const TextStyle(
                          color: AppTheme.rose,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                  ],
                ),
                const SizedBox(width: 8),

                Icon(
                  Icons.chevron_right_rounded,
                  color: Colors.grey.shade400,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
