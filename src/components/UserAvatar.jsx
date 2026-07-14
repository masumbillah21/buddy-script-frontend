import React from 'react';

export default function UserAvatar({ user, className, style = {} }) {
  if (user && user.profile_image) {
    return (
      <img 
        src={user.profile_image} 
        alt={`${user.first_name || ''} ${user.last_name || ''}`} 
        className={className} 
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          aspectRatio: '1/1',
          ...style
        }}
      />
    );
  }
  
  const firstLetter = user && user.first_name ? user.first_name.charAt(0).toUpperCase() : '?';
  const colors = ['#377DFF', '#10B981', '#FF6B6B', '#F59E0B', '#8B5CF6', '#EC4899'];
  const charCode = user && user.first_name ? user.first_name.charCodeAt(0) : 0;
  const bgColor = colors[charCode % colors.length];

  return (
    <div 
      className={className} 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        color: '#ffffff',
        fontWeight: '600',
        borderRadius: '50%',
        textTransform: 'uppercase',
        userSelect: 'none',
        aspectRatio: '1/1',
        ...style
      }}
    >
      {firstLetter}
    </div>
  );
}
