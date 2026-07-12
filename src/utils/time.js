export function formatRelativeTime(dateStr, isShort = false) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  
  const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (isShort) {
    if (diffMins < 1) return '1m';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  } else {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute ago`;
    if (diffHours < 24) return `${diffHours} hour ago`;
    if (diffDays < 7) return `${diffDays} day ago`;
    return date.toLocaleDateString();
  }
}
