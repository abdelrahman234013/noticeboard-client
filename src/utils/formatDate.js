const formatDate = (value, options = {}) => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: options.includeTime ? 'short' : undefined,
  }).format(date);
};

export default formatDate;
