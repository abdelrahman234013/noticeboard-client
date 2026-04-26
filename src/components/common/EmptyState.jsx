const EmptyState = ({ icon: Icon, heading, message, title, description, cta, onCta }) => {
  const headingText = heading || title || 'Nothing here';
  const messageText = message || description || 'There is no data to show right now.';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        gap: 16,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: '#14141B',
          border: '1px solid #22222E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {Icon && <Icon size={26} color="#374151" strokeWidth={1.5} />}
      </div>
      <div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#D1D5DB', marginBottom: 6 }}>
          {headingText}
        </div>
        <div style={{ fontSize: 14, color: '#4B5563', maxWidth: 320 }}>{messageText}</div>
      </div>
      {cta && (
        <button
          onClick={onCta}
          type="button"
          style={{
            marginTop: 4,
            padding: '9px 20px',
            borderRadius: 8,
            background: '#06B6D4',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {cta}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
