import { useNavigate } from 'react-router-dom';

import { createNotice } from '../../api/noticeApi.js';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import NoticeEditor from './NoticeEditor.jsx';

const CreateNoticePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await createNotice(formData);
    navigate('/admin/notices');
  };

  return (
    <AdminLayout>
      <NoticeEditor mode="create" onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default CreateNoticePage;
