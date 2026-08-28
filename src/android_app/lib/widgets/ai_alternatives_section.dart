import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class AIAlternativesSection extends StatelessWidget {
  final List<AIAlternative> alternatives;
  final String originalQuery;
  final bool isLoading;

  const AIAlternativesSection({
    super.key,
    required this.alternatives,
    required this.originalQuery,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    if (isLoading) {
      return Container(
        margin: const EdgeInsets.only(top: 16),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.3),
          ),
        ),
        child: const Center(
          child: Column(
            children: [
              SizedBox(
                width: 28,
                height: 28,
                child: CircularProgressIndicator(
                  color: Color(0xFF8B5CF6),
                  strokeWidth: 2.5,
                ),
              ),
              SizedBox(height: 12),
              Text(
                'Gemini AI analyzing active ingredient substitutes...',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      );
    }

    if (alternatives.isEmpty) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.only(top: 20, bottom: 24),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFF8B5CF6).withValues(alpha: 0.4),
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF8B5CF6).withValues(alpha: 0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF8B5CF6), Color(0xFFEC4899)],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.auto_awesome_rounded, color: Colors.white, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'AI Smart Alternatives & Substitutes',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      'Active ingredient matches for "$originalQuery"',
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

          // List of Alternatives
          ...alternatives.map((alt) => _buildAlternativeCard(context, alt, provider)),
        ],
      ),
    );
  }

  Widget _buildAlternativeCard(BuildContext context, AIAlternative alt, AppProvider provider) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: provider.isDarkMode ? AppTheme.darkCardSubtle : AppTheme.lightCardSubtle,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Brand & Match score row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF8B5CF6).withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  alt.brand.toUpperCase(),
                  style: const TextStyle(
                    color: Color(0xFF8B5CF6),
                    fontWeight: FontWeight.w900,
                    fontSize: 10,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.emerald.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check_circle_rounded, color: AppTheme.emerald, size: 12),
                    const SizedBox(width: 4),
                    Text(
                      '${alt.matchScore}% Match',
                      style: const TextStyle(
                        color: AppTheme.emerald,
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Name
          Text(
            alt.name,
            style: TextStyle(
              fontWeight: FontWeight.w800,
              fontSize: 14,
              color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
            ),
          ),
          const SizedBox(height: 4),

          // Why explanation
          Text(
            alt.why,
            style: TextStyle(
              fontSize: 11,
              color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 8),

          // Active ingredients chips
          if (alt.ingredients.isNotEmpty) ...[
            Wrap(
              spacing: 6,
              runSpacing: 4,
              children: alt.ingredients.take(3).map((ing) {
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: provider.isDarkMode ? const Color(0xFF2E3245) : Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    '• $ing',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      color: provider.isDarkMode ? Colors.grey.shade300 : Colors.grey.shade700,
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 10),
          ],

          // Footer: Price & Search Trigger CTA
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (alt.estimatedPrice > 0)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Est. Price',
                      style: TextStyle(fontSize: 9, color: Colors.grey),
                    ),
                    Text(
                      '~₹${alt.estimatedPrice.toStringAsFixed(0)}',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        color: provider.isDarkMode ? AppTheme.darkTextPrimary : AppTheme.lightTextPrimary,
                      ),
                    ),
                  ],
                )
              else
                const SizedBox.shrink(),

              ElevatedButton(
                onPressed: () {
                  provider.search(alt.name);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text('Compare Deals', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                    SizedBox(width: 4),
                    Icon(Icons.arrow_forward_rounded, size: 12),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
