import { X } from 'lucide-react';

const ConfirmDialog = ({
  open,
  title = 'Are you sure?',
  message = 'Please confirm this action.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
    >
      <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 16, padding: 28, width: '100%', maxWidth: 440, boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#F1F0F5' }}>{title}</div>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
            <X size={18} />
          </button>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{ padding: '10px 18px', borderRadius: 9, border: '1px solid #22222E', background: 'transparent', color: '#9CA3AF', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '10px 18px',
              borderRadius: 9,
              border: danger ? '1px solid rgba(239,68,68,0.3)' : 'none',
              background: danger ? 'rgba(239,68,68,0.12)' : '#06B6D4',
              color: danger ? '#EF4444' : '#000',
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
