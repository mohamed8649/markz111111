'use client';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Search, BookOpen, CreditCard, Award } from 'lucide-react';

export default function LandingPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!searchQuery.trim()) {
      setError(t('searchError'));
      return;
    }

    setLoading(true);

    try {
      // 1. Check certificates table
      const { data: cert, error: certError } = await supabase
        .from('certificates')
        .select('id')
        .eq('certificate_number', searchQuery.trim())
        .maybeSingle();

      if (cert) {
        router.push(`/verify/certificate/${cert.id}`);
        return;
      }

      // 2. Check memberships table
      const { data: member, error: memberError } = await supabase
        .from('memberships')
        .select('id')
        .eq('membership_number', searchQuery.trim())
        .maybeSingle();

      if (member) {
        router.push(`/verify/membership/${member.id}`);
        return;
      }

      setError(t('notFoundTitle') + ': ' + t('notFoundDesc'));
    } catch (err) {
      console.error('Verification query error:', err);
      setError(t('somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">{t('heroTitle')}</h1>
          <p className="hero-subtitle">{t('heroSubtitle')}</p>
          
          {/* Verification input */}
          <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} className="accent-icon" style={{ color: 'var(--success-color)' }} />
              <span>{t('verifySectionTitle')}</span>
            </h3>

            {error && <div className="alert error" style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{error}</div>}

            <form onSubmit={handleVerify} style={{ display: 'flex', gap: '0.75rem', flexDirection: lang === 'ar' ? 'row' : 'row' }} id="landing_verify_form">
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t('verifyInputPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingStart: '2.5rem' }}
                  required
                  id="landing_verify_input"
                />
                <Search size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: lang === 'ar' ? 'auto' : '1rem', right: lang === 'ar' ? '1rem' : 'auto', color: 'var(--text-secondary)' }} />
              </div>
              <button type="submit" className="btn" disabled={loading} style={{ width: 'auto', flexShrink: 0 }} id="landing_verify_submit_btn">
                {loading ? t('loading') : t('verifyBtn')}
              </button>
            </form>
          </div>
        </section>

        {/* Feature section */}
        <section style={{ padding: '5rem 2rem', background: 'var(--bg-secondary)' }}>
          <h2 className="section-title">{t('featuresTitle')}</h2>
          <p className="section-subtitle">{lang === 'ar' ? 'نقدم حلولاً رقمية شاملة لإدارة وتأكيد وثائق التدريب والمشتركين.' : 'We offer comprehensive digital systems to manage and verify training documents.'}</p>
          
          <div className="cards-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('feature1Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t('feature1Desc')}</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <CreditCard size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('feature2Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t('feature2Desc')}</p>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                <BookOpen size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{t('feature3Title')}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{t('feature3Desc')}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>&copy; {new Date().getFullYear()} {lang === 'ar' ? 'مركز التدريب الاحترافي. جميع الحقوق محفوظة.' : 'Professional Training Center. All rights reserved.'}</p>
      </footer>
    </div>
  );
}
