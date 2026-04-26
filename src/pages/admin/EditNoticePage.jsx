import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAdminNotices, updateNotice } from '../../api/noticeApi.js';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import Loader from '../../components/common/Loader.jsx';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import NoticeEditor from './NoticeEditor.jsx';

const EditNoticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const firstRes = await getAdminNotices({ page: 1, limit: 100 });
        const firstItems = firstRes?.data?.items || [];
        const totalPages = firstRes?.data?.pagination?.totalPages || 1;
        let found = firstItems.find((n) => n._id === id);
        for (let p = 2; !found && p <= totalPages; p += 1) {
          const r = await getAdminNotices({ page: p, limit: 100 });
          found = (r?.data?.items || []).find((n) => n._id === id);
        }
        if (!found) throw new Error('Notice not found');
        setNotice(found);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load notice');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateNotice(id, formData);
    navigate('/admin/notices');
  };

  return (
    <AdminLayout>
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <Loader text="Loading notice..." />
      ) : (
        notice && <NoticeEditor mode="edit" initial={notice} onSubmit={handleSubmit} />
      )}
    </AdminLayout>
  );
};

export default EditNoticePage;
