import { Eye, Plus, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { createCategory, deleteCategory, getCategories, updateCategory } from '../../api/categoryApi.js';
import { StatusBadge } from '../../components/common/Badges.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';

const inputStyle = { width: '100%', background: '#0A0A0F', border: '1px solid #22222E', borderRadius: 9, padding: '11px 14px', color: '#D1D5DB', fontSize: 14, outline: 'none', boxSizing: 'border-box' };
const labelStyle = { fontSize: 12, color: '#6B7280', fontWeight: 600, display: 'block', marginBottom: 7 };

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
  const [editing, setEditing] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModal('create');
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || '', description: cat.description || '' });
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditing(null);
    setForm({ name: '', description: '' });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Category name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing) await updateCategory(editing._id, { name: form.name.trim(), description: form.description.trim() });
      else await createCategory({ name: form.name.trim(), description: form.description.trim() });
      await fetchCategories();
      closeModal();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setSaving(true);
    try {
      await deleteCategory(toDelete._id);
      setToDelete(null);
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: '#F1F0F5', margin: '0 0 5px', fontWeight: 400 }}>Categories</h1>
          <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>Organise your notices into focused topics.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 9, background: '#06B6D4', color: '#000', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={14} strokeWidth={2} /> Create Category
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <Loader text="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} heading="No categories yet" message="Create your first category to start organising notices." cta="Create Category" onCta={openCreate} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              onMouseEnter={() => setHovered(cat._id)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 14, padding: '22px 24px', position: 'relative', transition: 'border-color 0.15s', borderColor: hovered === cat._id ? '#2A2A3E' : '#22222E' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 20, color: '#F1F0F5', marginBottom: 3 }}>{cat.name}</div>
                  {cat.slug && <div style={{ fontSize: 12, color: '#4B5563', fontFamily: 'monospace' }}>/{cat.slug}</div>}
                </div>
                <StatusBadge status={cat.isActive ? 'active' : 'inactive'} />
              </div>
              {cat.description && <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: '0 0 16px' }}>{cat.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4B5563' }}>
                  <Eye size={12} /> Active
                </span>
                {hovered === cat._id && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #22222E', background: 'transparent', color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(cat)}
                      style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 12, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
          <div style={{ background: '#14141B', border: '1px solid #22222E', borderRadius: 16, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 22, color: '#F1F0F5' }}>
                {modal === 'create' ? 'New Category' : 'Edit Category'}
              </div>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4B5563' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>NAME</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Student Affairs" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>DESCRIPTION</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description of this category"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="button" onClick={closeModal} style={{ flex: 1, padding: 10, borderRadius: 9, border: '1px solid #22222E', background: 'transparent', color: '#9CA3AF', fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{ flex: 2, padding: 10, borderRadius: 9, border: 'none', background: '#06B6D4', color: '#000', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete Category"
        message={`Are you sure you want to delete "${toDelete?.name}"? Notices in this category will keep their reference.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={saving}
      />
    </AdminLayout>
  );
};

export default CategoriesPage;
