import { AlertTriangle, Clock, Eye, Pin } from 'lucide-react';
import { useState } from 'react';

import { daysUntil, timeAgo, truncate } from '../../utils/format.js';
import { CategoryBadge } from '../common/Badges.jsx';

const NoticeCard = ({ notice, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const categoryName = notice.category?.name || notice.category;
  const expiryDate = notice.expiryDate || notice.expiresAt;
  const days = daysUntil(expiryDate);
  const expiringSoon = expiryDate && days !== null && days >= 0 && days <= 3;
  const pinned = notice.isPinned ?? notice.pinned;
  const views = notice.viewCount ?? notice.views ?? 0;
  const authorName = notice.author?.name || notice.author || '';
  const excerpt = notice.excerpt || truncate(notice.description || '', 140);

  return (
    <div
      onClick={() => onClick && onClick(notice)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#14141B',
        border: '1px solid #22222E',
        borderRadius: 14,
        padding: '22px 24px',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'all 0.22s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <CategoryBadge name={categoryName} />
        <div style={{ display: 'flex', gap: 6 }}>
          {pinned && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 99,
                background: 'rgba(6,182,212,0.12)',
                color: '#06B6D4',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <Pin size={10} /> Pinned
            </span>
          )}
          {expiringSoon && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 99,
                background: 'rgba(245,158,11,0.12)',
                color: '#F59E0B',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={10} /> {days === 0 ? 'Expires today' : `${days}d left`}
            </span>
          )}
        </div>
      </div>
      <div>
        <h3
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 18,
            fontWeight: 400,
            color: '#F1F0F5',
            lineHeight: 1.35,
            margin: '0 0 8px',
          }}
        >
          {notice.title}
        </h3>
        <p
          style={{
            fontSize: 13.5,
            color: '#6B7280',
            lineHeight: 1.6,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {excerpt}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4B5563' }}>
          <Eye size={13} />
          {Number(views).toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4B5563' }}>
          <Clock size={13} />
          {timeAgo(notice.createdAt)}
        </span>
        {authorName && <span style={{ fontSize: 12, color: '#4B5563', marginLeft: 'auto' }}>{authorName}</span>}
      </div>
    </div>
  );
};

export default NoticeCard;
