import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:smartprice_ai/models/product.dart';
import 'package:smartprice_ai/providers/app_provider.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Model Serialization & Deserialization Tests', () {
    test('Product parses valid and boundary JSON values safely', () {
      final json = {
        'name': 'Apple iPhone 15',
        'price': 65999,
        'mrp': 79900,
        'platform': 'Amazon',
        'url': 'https://amazon.in/dp/example',
        'image': 'https://amazon.in/image.jpg',
        'rating': 4.6,
        'reviews': '14,280',
        'delivery': 'FREE Same-Day Delivery',
        'in_stock': true,
        'category': 'Electronics',
      };

      final product = Product.fromJson(json);
      expect(product.name, 'Apple iPhone 15');
      expect(product.price, 65999.0);
      expect(product.mrp, 79900.0);
      expect(product.platform, 'Amazon');
      expect(product.inStock, true);
      expect(product.discountPercentage, 17);
    });

    test('AIAlternative parses AI recommendation JSON accurately', () {
      final json = {
        'name': 'Surf Excel Matic Liquid Detergent - 1L',
        'brand': 'Surf Excel',
        'why': 'Powerful stain removal formula matching Ariel performance.',
        'ingredients': ['Active Enzyme Blend', 'Optical Brighteners'],
        'uses': ['Machine wash', 'Hand wash'],
        'match_score': 93,
        'category': 'grocery',
        'estimatedPrice': 199,
        'sampleStores': [
          {'platform': 'Amazon India', 'price': 199, 'delivery': 'Same-Day'},
          {'platform': 'Blinkit', 'price': 201, 'delivery': '10-15 mins'}
        ],
      };

      final alt = AIAlternative.fromJson(json);
      expect(alt.name, 'Surf Excel Matic Liquid Detergent - 1L');
      expect(alt.brand, 'Surf Excel');
      expect(alt.matchScore, 93);
      expect(alt.ingredients.length, 2);
      expect(alt.sampleStores.length, 2);
      expect(alt.sampleStores[0].price, 199.0);
    });
  });

  group('Account Data Isolation Unit Tests', () {
    test('Account A and Account B have strictly separated watchlists and searches', () async {
      SharedPreferences.setMockInitialValues({});
      final provider = AppProvider();

      // 1. Account A logs in
      await provider.login('user_a@smartprice.ai', 'password123', fullName: 'User A');
      expect(provider.isAuthenticated, true);
      expect(provider.currentUser?.email, 'user_a@smartprice.ai');
      expect(provider.watchlist.isEmpty, true);

      // Account A adds Colgate to watchlist
      final colgate = Product(
        name: 'Colgate Strong Teeth 200g',
        price: 115,
        mrp: 130,
        platform: 'Blinkit',
        url: 'https://blinkit.com/colgate',
        image: 'https://grofers.com/colgate.jpg',
        rating: 4.8,
        reviews: '50k',
        delivery: '10 mins',
        inStock: true,
        category: 'Grocery',
      );
      await provider.toggleWatchlist(colgate);
      expect(provider.watchlist.length, 1);
      expect(provider.isInWatchlist(colgate), true);

      // 2. Account A logs out
      await provider.logout();
      expect(provider.isAuthenticated, false);
      expect(provider.currentUser, null);
      expect(provider.watchlist.isEmpty, true);

      // 3. Fresh Account B signs up
      await provider.signup('user_b@smartprice.ai', 'password456', fullName: 'User B');
      expect(provider.isAuthenticated, true);
      expect(provider.currentUser?.email, 'user_b@smartprice.ai');
      // Account B MUST NOT see Account A's items
      expect(provider.watchlist.isEmpty, true);
      expect(provider.isInWatchlist(colgate), false);

      // Account B adds iPhone 15
      final iphone = Product(
        name: 'Apple iPhone 15 128GB',
        price: 65999,
        mrp: 79900,
        platform: 'Amazon',
        url: 'https://amazon.in/iphone15',
        image: 'https://amazon.in/iphone.jpg',
        rating: 4.6,
        reviews: '14k',
        delivery: 'Same-day',
        inStock: true,
        category: 'Electronics',
      );
      await provider.toggleWatchlist(iphone);
      expect(provider.watchlist.length, 1);
      expect(provider.isInWatchlist(iphone), true);
      expect(provider.isInWatchlist(colgate), false);

      // 4. Account B logs out and Account A logs back in
      await provider.logout();
      await provider.login('user_a@smartprice.ai', 'password123');
      expect(provider.currentUser?.email, 'user_a@smartprice.ai');
      // Account A should see Colgate restored, but NOT iPhone 15
      expect(provider.watchlist.length, 1);
      expect(provider.isInWatchlist(colgate), true);
      expect(provider.isInWatchlist(iphone), false);
    });
  });
}
