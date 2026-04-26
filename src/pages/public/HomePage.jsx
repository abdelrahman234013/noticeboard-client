import { FileText, Pin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCategories } from '../../api/categoryApi.js';
import { getPublicNotices } from '../../api/noticeApi.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import NoticeCard from '../../components/notices/NoticeCard.jsx';

const PER_PAGE = 6;

const HomePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalItems: 0 });
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await getCategories();
        setCategories(res?.data || []);
      } catch {
        // categories optional for filter
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchNotices = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: PER_PAGE, sort };
        if (catFilter !== 'all') params.category = catFilter;
        if (pinnedOnly) params.pinnedOnly = true;
        const res = await getPublicNotices(params);
        if (cancelled) return;
        const payload = res?.data || {};
        setNotices(payload.items || []);
        setPagination({
          page: payload.pagination?.page ?? page,
          totalPages: payload.pagination?.totalPages ?? 1,
          totalItems: payload.pagination?.totalItems ?? 0,
        });
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Failed to load notices');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchNotices();
    return () => {
      cancelled = true;
    };
  }, [page, catFilter, sort, pinnedOnly]);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <div
        style={{
          borderBottom: '1px solid #22222E',
          padding: '48px 32px 40px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 70% 50% at 50% -20%,rgba(6,182,212,0.08),transparent)',
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: '#06B6D4', textTransform: 'uppercase', fontWeight: 600, marginBottom: 14 }}>
          Digital Noticeboard
        </div>
        <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 'clamp(36px,5vw,60px)', color: '#F1F0F5', margin: '0 0 14px', fontWeight: 400, lineHeight: 1.1 }}>
          Official Noticeboard
        </h1>
        <p style={{ color: '#4B5563', fontSize: 15, margin: 0, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
          Stay informed with the latest announcements, events, and opportunities from across campus.
        </p>
      </div>

      <div style={{ borderBottom: '1px solid #1A1A24', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: 'rgba(20,20,27,0.6)' }}>
        <select
          value={catFilter}
          onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
          style={{ background: '#14141B', border: '1px solid #22222E', color: '#9CA3AF', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          style={{ background: '#14141B', border: '1px solid #22222E', color: '#9CA3AF', borderRadius: 8, padding: '7px 12px', fontSize: 13, outline: 'none', cursor: 'pointer' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Popular</option>
        </select>
        <button
          type="button"
          onClick={() => { setPinnedOnly(!pinnedOnly); setPage(1); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${pinnedOnly ? '#06B6D4' : '#22222E'}`, background: pinnedOnly ? 'rgba(6,182,212,0.1)' : 'transparent', color: pinnedOnly ? '#06B6D4' : '#6B7280', fontSize: 13, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}
        >
          <Pin size={13} strokeWidth={1.5} /> Pinned only
        </button>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#4B5563' }}>
          {pagination.totalItems} notice{pagination.totalItems !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ padding: 32, maxWidth: 1280, margin: '0 auto' }}>
        {loading && <Loader />}
        {!loading && error && <ErrorMessage message={error} />}
        {!loading && !error && notices.length === 0 && (
          <EmptyState icon={FileText} heading="No notices found" message="Try adjusting your filters or check back later." />
        )}
        {!loading && !error && notices.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 20 }}>
            {notices.map((n, i) => (
              <div key={n._id} style={{ opacity: 0, animation: 'nb-fadeup 0.4s ease forwards', animationDelay: `${i * 60}ms` }}>
                <NoticeCard notice={n} onClick={(notice) => navigate(`/notices/${notice._id}`)} />
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                style={{ width: 36, height: 36, borderRadius: 8, border: page === i + 1 ? 'none' : '1px solid #22222E', background: page === i + 1 ? '#06B6D4' : 'transparent', color: page === i + 1 ? '#000' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
