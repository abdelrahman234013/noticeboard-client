import { useEffect, useMemo, useState } from 'react';

import { getCategories } from '../../api/categoryApi';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Loader from '../common/Loader.jsx';

const toDateTimeLocal = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const pad = (input) => String(input).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const defaultValues = {
  title: '',
  description: '',
  category: '',
  expiryDate: '',
  isPinned: false,
  attachment: null,
};

const NoticeForm = ({ initialValues, onSubmit, loading, submitText = 'Save Notice' }) => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        title: initialValues.title || '',
        description: initialValues.description || '',
        category: initialValues.category?._id || initialValues.category || '',
        expiryDate: toDateTimeLocal(initialValues.expiryDate),
        isPinned: Boolean(initialValues.isPinned),
        attachment: null,
      });
    }
  }, [initialValues]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Failed to load categories');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const currentAttachment = useMemo(() => initialValues?.attachment || null, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked, files } = event.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formValues.title.trim() || !formValues.description.trim() || !formValues.category) {
      setError('Title, description, and category are required.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formValues.title.trim());
    payload.append('description', formValues.description.trim());
    payload.append('category', formValues.category);
    payload.append('isPinned', String(formValues.isPinned));

    if (formValues.expiryDate) {
      payload.append('expiryDate', new Date(formValues.expiryDate).toISOString());
    }

    if (formValues.attachment) {
      payload.append('attachment', formValues.attachment);
    }

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError?.message || 'Failed to save notice');
    }
  };

  if (categoryLoading) {
    return <Loader text="Loading notice form..." />;
  }

  return (
    <div className="card">
      <div className="card-body">
        <ErrorMessage message={error} />

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={formValues.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formValues.description} onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formValues.category} onChange={handleChange}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="datetime-local"
                value={formValues.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="attachment">Attachment</label>
            <input id="attachment" name="attachment" type="file" onChange={handleChange} />
            {currentAttachment?.url && (
              <small className="text-muted">
                Current attachment:{' '}
                <a href={`http://localhost:5000${currentAttachment.url}`} target="_blank" rel="noreferrer">
                  {currentAttachment.originalName || 'View file'}
                </a>
              </small>
            )}
          </div>

          <label className="inline-row" style={{ fontWeight: 600 }}>
            <input type="checkbox" name="isPinned" checked={formValues.isPinned} onChange={handleChange} />
            Pin this notice
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
