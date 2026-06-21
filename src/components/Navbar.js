'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Award, LogOut, User, Shield, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (profile?.role === 'admin') return '/admin';
    return '/member';
  };

  return (
    <nav className="navbar" id="app_navbar">
      <Link href="/" className="nav-logo">
        <Award className="accent-icon" />
        <span>{lang === 'ar' ? 'مركز التدريب' : 'Training Center'}</span>
      </Link>

      {/* Desktop Links */}
      <div className="nav-links">
        <button onClick={toggleLanguage} className="lang-toggle" id="lang_toggle_btn">
          {t(lang === 'ar' ? 'english' : 'arabic')}
        </button>

        <Link href="/" className="nav-btn secondary">
          {t('home')}
        </Link>

        {user ? (
          <>
            <Link href={getDashboardLink()} className="nav-btn secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {profile?.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
              <span>{profile?.role === 'admin' ? t('adminDashboard') : t('memberPortal')}</span>
            </Link>
            <button onClick={signOut} className="nav-btn primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} id="logout_btn">
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-btn secondary">
              {t('login')}
            </Link>
            <Link href="/register" className="nav-btn primary">
              {t('register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
