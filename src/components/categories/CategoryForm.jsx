import { useEffect, useState } from 'react';

import ErrorMessage from '../common/ErrorMessage.jsx';

const CategoryForm = ({ initialValues, onSubmit, loading, submitText = 'Save Category', onCancel }) => {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValues({
      name: initialValues?.name || '',
      description: initialValues?.description || '',
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValues.name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      await onSubmit({
        name: formValues.name.trim(),
        description: formValues.description.trim(),
      });

      if (!initialValues) {
        setFormValues({ name: '', description: '' });
      }
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError?.message || 'Failed to save category');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 style={{ marginTop: 0 }}>{initialValues ? 'Edit Category' : 'Add Category'}</h3>
        <ErrorMessage message={error} />

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={formValues.name} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formValues.description} onChange={handleChange} />
          </div>

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : submitText}
            </button>
            {initialValues && (
              <button type="button" className="btn btn-outline" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
