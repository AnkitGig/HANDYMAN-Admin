export const formatDate = (date, withTime = true) =>
  new Date(date).toLocaleString('en-US',
    withTime
      ? { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }
      : { month: 'short', day: 'numeric', year: 'numeric' });
