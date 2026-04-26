import formatDate from '../../utils/formatDate.js';
import EmptyState from '../common/EmptyState.jsx';

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  if (!categories.length) {
    return <EmptyState title="No categories" description="Create your first category to organize notices." />;
  }

  return (
    <div className="card">
      <div className="card-body table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Description</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.description || 'No description'}</td>
                <td>{formatDate(category.createdAt)}</td>
                <td>
                  <div className="actions">
                    <button type="button" className="btn btn-secondary" onClick={() => onEdit(category)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => onDelete(category)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
