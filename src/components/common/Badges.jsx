const STATUS_MAP = {
  active: { label: 'Active', dot: '#10B981', text: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  expired: { label: 'Expired', dot: '#EF4444', text: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  inactive: { label: 'Inactive', dot: '#6B7280', text: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  pinned: { label: 'Pinned', dot: '#06B6D4', text: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  admin: { label: 'Admin', dot: '#06B6D4', text: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  user: { label: 'User', dot: '#6B7280', text: '#9CA3AF', bg: 'rgba(107,114,128,0.1)' },
};

const CATEGORY_COLORS = {
  Academic: '#06B6D4',
  Events: '#8B5CF6',
  Administrative: '#F59E0B',
  Career: '#10B981',
  Housing: '#F97316',
  'Health & Wellness': '#EC4899',
};

export const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.inactive;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '2px 10px',
        borderRadius: 99,
        background: s.bg,
        fontSize: 11,
        fontWeight: 600,
        color: s.text,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

export const CategoryBadge = ({ name }) => {
  if (!name) return null;
  const color = CATEGORY_COLORS[name] || '#6B7280';
  return (
    <span
      style={{
        padding: '2px 9px',
        borderRadius: 99,
        background: `${color}18`,
        color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      {name}
    </span>
  );
};

export default { StatusBadge, CategoryBadge };
