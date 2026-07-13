import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import UserAvatar from './UserAvatar';

export default function ReactionsModal({ postId, commentId, onClose }) {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const endpoint = commentId 
          ? `/api/comments/${commentId}/reactions`
          : `/api/posts/${postId}/reactions`;
        const response = await apiRequest(endpoint);
        if (response.ok) {
          const result = await response.json();
          setReactions(result.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch reactions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReactions();
  }, [postId, commentId]);

  // Group reactions
  const grouped = {
    all: reactions,
    like: reactions.filter(r => r.reaction_type === 'like'),
    love: reactions.filter(r => r.reaction_type === 'love'),
    haha: reactions.filter(r => r.reaction_type === 'haha'),
    wow: reactions.filter(r => r.reaction_type === 'wow'),
    sad: reactions.filter(r => r.reaction_type === 'sad'),
    angry: reactions.filter(r => r.reaction_type === 'angry')
  };


  const reactionColors = {
    like: '#377DFF',
    love: '#F33A5E',
    haha: '#FFCC4D',
    wow: '#FFCC4D',
    sad: '#FFCC4D',
    angry: '#F7583B'
  };

  const renderReactionLabel = (type) => {
    if (type === 'like') {
      return (
        <span className="_reaction_like" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up" style={{ stroke: '#377DFF' }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        </span>
      );
    }
    if (type === 'love') {
      return (
        <span className="_reaction_heart" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart" style={{ stroke: 'red' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </span>
      );
    }
    const emojiMap = {
      all: 'All',
      haha: '😆',
      wow: '😮',
      sad: '😢',
      angry: '😡'
    };
    return emojiMap[type] || '';
  };

  const renderMiniReaction = (type) => {
    if (type === 'like') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up" style={{ display: 'block' }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
      );
    }
    if (type === 'love') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart" style={{ display: 'block' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      );
    }
    const emojiMap = {
      haha: '😆',
      wow: '😮',
      sad: '😢',
      angry: '😡'
    };
    return emojiMap[type] ? (
      <span style={{ fontSize: '10px', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '-1px' }}>
        {emojiMap[type]}
      </span>
    ) : null;
  };

  const tabs = [
    { id: 'all', count: reactions.length },
    { id: 'like', count: grouped.like.length },
    { id: 'love', count: grouped.love.length },
    { id: 'haha', count: grouped.haha.length },
    { id: 'wow', count: grouped.wow.length },
    { id: 'sad', count: grouped.sad.length },
    { id: 'angry', count: grouped.angry.length },
  ];

  // Only show tabs that have reactions, plus the "All" tab
  const activeTabs = tabs.filter(t => t.id === 'all' || t.count > 0);

  const displayedUsers = grouped[activeTab] || [];

  return (
    <div className="reactions-modal-overlay" onClick={onClose}>
      <div className="reactions-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="reactions-modal-header">
          <h3 className="reactions-modal-title">Post Reactions</h3>
          <button className="reactions-modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Tabs */}
        <div className="reactions-modal-tabs-container">
          {activeTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`reactions-modal-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '15px', marginRight: '4px', display: 'inline-flex', alignItems: 'center' }}>
                {renderReactionLabel(tab.id)}
              </span>
              <span className="reactions-modal-badge">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* User List */}
        <div className="reactions-modal-body">
          {loading ? (
            <div className="reactions-modal-loading">Loading reactions...</div>
          ) : displayedUsers.length === 0 ? (
            <div className="reactions-modal-empty">No reactions found.</div>
          ) : (
            <div className="reactions-modal-user-list">
              {displayedUsers.map(item => (
                <div key={item.id} className="reactions-modal-user-item">
                  <div className="reactions-modal-avatar-wrapper">
                    <UserAvatar user={item} className="reactions-modal-avatar" />
                    <span
                      className="reactions-modal-mini-emoji"
                      style={{ backgroundColor: reactionColors[item.reaction_type] || '#fff' }}
                    >
                      {renderMiniReaction(item.reaction_type)}
                    </span>
                  </div>
                  <div className="reactions-modal-user-info">
                    <span className="reactions-modal-user-name">{item.first_name} {item.last_name}</span>
                    <span className="reactions-modal-user-email">{item.email}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
