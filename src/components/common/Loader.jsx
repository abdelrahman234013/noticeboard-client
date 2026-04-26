const Loader = ({ text }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 48, gap: 14 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '2px solid #22222E',
          borderTopColor: '#06B6D4',
          animation: 'nb-spin 0.7s linear infinite',
        }}
      />
      {text && <div style={{ fontSize: 13, color: '#6B7280' }}>{text}</div>}
    </div>
  );
};

export default Loader;
