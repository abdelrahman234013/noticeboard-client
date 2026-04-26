import { AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getExpiringSoon, getPopularCategories, getPopularNotices } from '../../api/analyticsApi.js';
import { CategoryBadge } from '../../components/common/Badges.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { daysUntil } from '../../utils/format.js';

const AnalyticsPage = () => {
  const [popularNotices, setPopularNotices] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [pn, pc, exp] = await Promise.all([
          getPopularNotices(5),
          getPopularCategories(),
          getExpiringSoon(3),
        ]);
        setPopularNotices(pn?.data || []);
        setPopularCategories(pc?.data || []);
        setExpiring(exp?.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxNoticeViews = popularNotices[0]?.viewCount || 1;
  const maxCatViews = popularCategories[0]?.totalViews || 1;
  const totalCatViews = popularCategories.reduce((s, c) => s + (c.totalViews || 0), 0) || 1;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>Analytics</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Track notice performance and category engagement.</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader text="Loading analytics..." />
      ) : (
        <>
          {expiring.length > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <AlertTriangle size={18} color="#F59E0B" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13.5, color: '#F59E0B', fontWeight: 600, marginBottom: 6 }}>
                  Expiring Soon — {expiring.length} notice{expiring.length > 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {expiring.map((n) => {
                    const d = daysUntil(n.expiryDate);
                    return (
                      <span key={n._id} style={{ padding: '4px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, fontSize: 12, color: '#F59E0B' }}>
                        {n.title.slice(0, 40)}{n.title.length > 40 ? '…' : ''} · {d === 0 ? 'today' : `${d}d`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 24, alignItems: 'start' }}>
            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #1A1A24' }}>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#F1F0F5' }}>Top Notices by Views</div>
              </div>
              {popularNotices.length === 0 ? (
                <EmptyState icon={AlertTriangle} heading="No popular notices yet" message="Notice views will appear here once users start browsing." />
              ) : (
                <div>
                  {popularNotices.map((n, i) => (
                    <div key={n._id} style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A24', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 700, width: 20, textAlign: 'center' }}>#{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: '#D1D5DB', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                          {n.title}
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: '#22222E', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 2, background: '#06B6D4', width: `${((n.viewCount || 0) / maxNoticeViews) * 100}%`, transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 13, color: '#06B6D4', fontWeight: 600, whiteSpace: 'nowrap' }}>{(n.viewCount || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #1A1A24' }}>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 18, color: '#F1F0F5' }}>Popular Categories</div>
              </div>
              {popularCategories.length === 0 ? (
                <EmptyState icon={AlertTriangle} heading="No category data yet" message="Category performance will appear after notices receive views." />
              ) : (
                <div>
                  {popularCategories.map((c, i) => (
                    <div key={c._id} style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A24', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 13, color: '#4B5563', fontWeight: 700, width: 20, textAlign: 'center' }}>#{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center', gap: 8 }}>
                          {c.name ? <CategoryBadge name={c.name} /> : <span style={{ color: '#6B7280', fontSize: 12 }}>Unknown</span>}
                          <span style={{ fontSize: 12, color: '#4B5563' }}>
                            {(((c.totalViews || 0) / totalCatViews) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: '#22222E' }}>
                          <div style={{ height: '100%', borderRadius: 2, background: '#8B5CF6', width: `${((c.totalViews || 0) / maxCatViews) * 100}%` }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 13, color: '#8B5CF6', fontWeight: 600 }}>{(c.totalViews || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AnalyticsPage;
