import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../theme/app_theme.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isSignUp = false;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String _errorMessage = '';
  bool _isLoading = false;

  void _submit() async {
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final name = _nameController.text.trim();

    if (email.isEmpty || !email.contains('@')) {
      setState(() => _errorMessage = 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setState(() => _errorMessage = 'Password must be at least 6 characters.');
      return;
    }
    if (_isSignUp && name.isEmpty) {
      setState(() => _errorMessage = 'Please enter your full name.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final provider = Provider.of<AppProvider>(context, listen: false);

    try {
      if (_isSignUp) {
        await provider.signup(email, password, fullName: name);
      } else {
        await provider.login(email, password, fullName: name.isNotEmpty ? name : null);
      }

      if (mounted) {
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Authentication failed: $e';
          _isLoading = false;
        });
      }
    }
  }

  void _handleGoogleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    final provider = Provider.of<AppProvider>(context, listen: false);
    try {
      await provider.loginWithGoogle();
      if (mounted) {
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Google sign in failed: $e';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<AppProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(_isSignUp ? 'Create Account' : 'Sign In'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Logo Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.accent,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.bolt_rounded, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'SmartPrice AI',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 20),
                    ),
                    Text(
                      'Compare store deals & track prices',
                      style: TextStyle(
                        fontSize: 12,
                        color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 28),

            // Tab Switcher
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCardSubtle,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() {
                        _isSignUp = false;
                        _errorMessage = '';
                      }),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: !_isSignUp ? AppTheme.primary : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Sign In',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: !_isSignUp ? Colors.white : (provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() {
                        _isSignUp = true;
                        _errorMessage = '';
                      }),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: _isSignUp ? AppTheme.primary : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Create Account',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: _isSignUp ? Colors.white : (provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            if (_errorMessage.isNotEmpty) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.rose.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.rose.withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline_rounded, color: AppTheme.rose, size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _errorMessage,
                        style: const TextStyle(color: AppTheme.rose, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (_isSignUp) ...[
              const Text('Full Name', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              const SizedBox(height: 6),
              TextField(
                controller: _nameController,
                decoration: InputDecoration(
                  hintText: 'Srinivas R',
                  prefixIcon: const Icon(Icons.person_outline_rounded, size: 20),
                  filled: true,
                  fillColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCardSubtle,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                ),
              ),
              const SizedBox(height: 16),
            ],

            const Text('Email Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            const SizedBox(height: 6),
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                hintText: 'name@example.com',
                prefixIcon: const Icon(Icons.email_outlined, size: 20),
                filled: true,
                fillColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCardSubtle,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
              ),
            ),
            const SizedBox(height: 16),

            const Text('Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            const SizedBox(height: 6),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: InputDecoration(
                hintText: '••••••••',
                prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
                filled: true,
                fillColor: provider.isDarkMode ? AppTheme.darkCard : AppTheme.lightCardSubtle,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Text(
                        _isSignUp ? 'Create Account' : 'Sign In',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                      ),
              ),
            ),
            const SizedBox(height: 20),

            // Divider: OR CONTINUE WITH
            Row(
              children: [
                Expanded(child: Divider(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder)),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text(
                    'OR CONTINUE WITH',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
                Expanded(child: Divider(color: provider.isDarkMode ? AppTheme.darkBorder : AppTheme.lightBorder)),
              ],
            ),
            const SizedBox(height: 16),

            // Google Sign In Button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: _isLoading ? null : _handleGoogleLogin,
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
            const SizedBox(height: 12),

            Center(
              child: TextButton(
                onPressed: () {
                  provider.continueAsGuest();
                  Navigator.pop(context);
                },
                child: Text(
                  'Continue as Guest',
                  style: TextStyle(
                    color: provider.isDarkMode ? AppTheme.darkTextSecondary : AppTheme.lightTextSecondary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
