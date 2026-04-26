const AuthForm = ({
  title,
  subtitle,
  fields,
  values,
  errors = {},
  onChange,
  onSubmit,
  submitText,
  loading,
  footer,
}) => {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card">
          <div className="card-body">
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
              {title}
            </h1>
            {subtitle && <p className="page-subtitle">{subtitle}</p>}

            <form className="form" onSubmit={onSubmit} style={{ marginTop: '1rem' }}>
              {fields.map((field) => (
                <div className="form-group" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={values[field.name] || ''}
                    onChange={onChange}
                  />
                  {errors[field.name] && <small className="text-danger">{errors[field.name]}</small>}
                </div>
              ))}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Please wait...' : submitText}
              </button>
            </form>

            {footer && <div style={{ marginTop: '1rem' }}>{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
