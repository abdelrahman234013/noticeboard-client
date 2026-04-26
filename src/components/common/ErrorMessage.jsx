const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: 10,
        color: '#EF4444',
        fontSize: 13.5,
        marginBottom: 16,
      }}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
