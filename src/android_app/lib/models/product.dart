class Product {
  final String name;
  final double price;
  final double mrp;
  final String platform;
  final String url;
  final String urlType; // 'direct' | 'search_fallback'
  final String image;
  final double rating;
  final String reviews;
  final String delivery;
  final bool inStock;
  final String category;

  Product({
    required this.name,
    required this.price,
    required this.mrp,
    required this.platform,
    required this.url,
    this.urlType = 'direct',
    required this.image,
    required this.rating,
    required this.reviews,
    required this.delivery,
    required this.inStock,
    required this.category,
  });

  bool get isDirect => urlType == 'direct';

  factory Product.fromJson(Map<String, dynamic> json) {
    final rawPrice = json['price'];
    final double parsedPrice = rawPrice is num ? rawPrice.toDouble() : double.tryParse(rawPrice?.toString() ?? '') ?? 0.0;

    final rawMrp = json['mrp'] ?? json['price'];
    final double parsedMrp = rawMrp is num ? rawMrp.toDouble() : double.tryParse(rawMrp?.toString() ?? '') ?? parsedPrice;

    final rawRating = json['rating'];
    final double parsedRating = rawRating is num ? rawRating.toDouble() : double.tryParse(rawRating?.toString() ?? '') ?? 4.5;

    final platformName = json['platform']?.toString() ?? 'Store';
    final urlTypeVal = json['url_type']?.toString() ?? 'direct';

    return Product(
      name: json['name']?.toString() ?? 'Product',
      price: parsedPrice,
      mrp: parsedMrp,
      platform: platformName,
      url: json['url']?.toString() ?? '',
      urlType: urlTypeVal,
      image: (json['image'] != null && json['image'].toString().isNotEmpty)
          ? json['image'].toString()
          : 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300',
      rating: parsedRating,
      reviews: json['reviews']?.toString() ?? '1,200',
      delivery: json['delivery']?.toString() ?? 'Standard Delivery',
      inStock: json['in_stock'] is bool ? json['in_stock'] : true,
      category: json['category']?.toString() ?? 'General',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'price': price,
      'mrp': mrp,
      'platform': platform,
      'url': url,
      'url_type': urlType,
      'image': image,
      'rating': rating,
      'reviews': reviews,
      'delivery': delivery,
      'in_stock': inStock,
      'category': category,
    };
  }

  int get discountPercentage {
    if (mrp <= price || mrp <= 0) return 0;
    return (((mrp - price) / mrp) * 100).round();
  }
}

class SampleStore {
  final String platform;
  final double price;
  final String delivery;

  SampleStore({
    required this.platform,
    required this.price,
    required this.delivery,
  });

  factory SampleStore.fromJson(Map<String, dynamic> json) {
    final rawPrice = json['price'];
    final double parsedPrice = rawPrice is num ? rawPrice.toDouble() : double.tryParse(rawPrice?.toString() ?? '') ?? 0.0;
    return SampleStore(
      platform: json['platform']?.toString() ?? 'Online Store',
      price: parsedPrice,
      delivery: json['delivery']?.toString() ?? 'Delivery Available',
    );
  }

  Map<String, dynamic> toJson() => {
    'platform': platform,
    'price': price,
    'delivery': delivery,
  };
}

class AIAlternative {
  final String name;
  final String brand;
  final String why;
  final List<String> ingredients;
  final List<String> uses;
  final int matchScore;
  final String category;
  final double estimatedPrice;
  final List<SampleStore> sampleStores;

  AIAlternative({
    required this.name,
    required this.brand,
    required this.why,
    required this.ingredients,
    required this.uses,
    required this.matchScore,
    required this.category,
    required this.estimatedPrice,
    required this.sampleStores,
  });

  factory AIAlternative.fromJson(Map<String, dynamic> json) {
    final rawIngredients = json['ingredients'] ?? [];
    final List<String> parsedIngredients = (rawIngredients is List)
        ? rawIngredients.map((e) => e.toString()).toList()
        : [];

    final rawUses = json['uses'] ?? [];
    final List<String> parsedUses = (rawUses is List)
        ? rawUses.map((e) => e.toString()).toList()
        : [];

    final rawScore = json['match_score'] ?? json['matchScore'] ?? 90;
    final int score = rawScore is num ? rawScore.toInt() : int.tryParse(rawScore.toString()) ?? 90;

    final rawPrice = json['estimatedPrice'] ?? json['price'] ?? 0;
    final double price = rawPrice is num ? rawPrice.toDouble() : double.tryParse(rawPrice.toString()) ?? 0.0;

    final rawStores = json['sampleStores'] ?? [];
    final List<SampleStore> stores = (rawStores is List)
        ? rawStores.map((s) => SampleStore.fromJson(s as Map<String, dynamic>)).toList()
        : [];

    return AIAlternative(
      name: json['name']?.toString() ?? 'Alternative Product',
      brand: json['brand']?.toString() ?? 'Brand',
      why: json['why']?.toString() ?? 'Recommended active ingredient substitute.',
      ingredients: parsedIngredients,
      uses: parsedUses,
      matchScore: score,
      category: json['category']?.toString() ?? 'General',
      estimatedPrice: price,
      sampleStores: stores,
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'brand': brand,
    'why': why,
    'ingredients': ingredients,
    'uses': uses,
    'match_score': matchScore,
    'category': category,
    'estimatedPrice': estimatedPrice,
    'sampleStores': sampleStores.map((s) => s.toJson()).toList(),
  };
}

class SearchRecord {
  final int id;
  final String query;
  final String city;
  final int resultCount;
  final DateTime searchedAt;

  SearchRecord({
    required this.id,
    required this.query,
    required this.city,
    required this.resultCount,
    required this.searchedAt,
  });

  factory SearchRecord.fromJson(Map<String, dynamic> json) {
    return SearchRecord(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id']?.toString() ?? '') ?? DateTime.now().millisecondsSinceEpoch,
      query: json['query']?.toString() ?? '',
      city: json['city']?.toString() ?? 'Chennai',
      resultCount: json['result_count'] is int ? json['result_count'] : int.tryParse(json['result_count']?.toString() ?? '') ?? 0,
      searchedAt: json['searched_at'] != null
          ? DateTime.tryParse(json['searched_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'query': query,
    'city': city,
    'result_count': resultCount,
    'searched_at': searchedAt.toIso8601String(),
  };
}

class UserProfile {
  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String avatarUrl;
  final String city;
  final String pincode;
  final bool darkMode;
  final double totalSavings;
  final bool isGuest;

  UserProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.avatarUrl,
    required this.city,
    required this.pincode,
    required this.darkMode,
    required this.totalSavings,
    this.isGuest = false,
  });

  factory UserProfile.guest() {
    return UserProfile(
      id: 'guest_${DateTime.now().millisecondsSinceEpoch}',
      fullName: 'Guest Shopper',
      email: 'guest@smartprice.ai',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      city: 'Chennai',
      pincode: '600028',
      darkMode: true,
      totalSavings: 0.0,
      isGuest: true,
    );
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id']?.toString() ?? 'user_${DateTime.now().millisecondsSinceEpoch}',
      fullName: json['full_name']?.toString() ?? 'SmartPrice User',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '+91 98765 43210',
      avatarUrl: json['avatar_url']?.toString() ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      city: json['city']?.toString() ?? 'Chennai',
      pincode: json['pincode']?.toString() ?? '600028',
      darkMode: json['dark_mode'] is bool ? json['dark_mode'] : true,
      totalSavings: (json['total_savings'] as num?)?.toDouble() ?? 0.0,
      isGuest: json['is_guest'] is bool ? json['is_guest'] : false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'full_name': fullName,
    'email': email,
    'phone': phone,
    'avatar_url': avatarUrl,
    'city': city,
    'pincode': pincode,
    'dark_mode': darkMode,
    'total_savings': totalSavings,
    'is_guest': isGuest,
  };
}
