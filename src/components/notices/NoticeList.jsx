import EmptyState from '../common/EmptyState.jsx';
import NoticeCard from './NoticeCard.jsx';

const NoticeList = ({ notices }) => {
  if (!notices.length) {
    return <EmptyState title="No notices found" description="Try changing the filters or search term." />;
  }

  return (
    <div className="list-stack">
      {notices.map((notice) => (
        <NoticeCard key={notice._id} notice={notice} />
      ))}
    </div>
  );
};

export default NoticeList;
