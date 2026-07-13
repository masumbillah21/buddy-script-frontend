import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { formatRelativeTime } from '../utils/time';
import ReactionsModal from './ReactionsModal';

export default function CommentSection({ postId, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyBoxes, setReplyBoxes] = useState({});
  const [replyTexts, setReplyTexts] = useState({});

  const loadComments = useCallback(async () => {
    try {
      const response = await apiRequest(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const result = await response.json();
        const mapped = result.data.map(commentData => ({
          id: commentData.id,
          author: `${commentData.user.first_name} ${commentData.user.last_name}`,
          avatar: '/assets/images/txt_img.png',
          text: commentData.content,
          likes: commentData.reactions_count || 0,
          liked: commentData.my_reaction ? true : false,
          myReaction: commentData.my_reaction,
          time: commentData.created_at,
          replies: commentData.replies ? commentData.replies.map(replyData => ({
            id: replyData.id,
            author: `${replyData.user.first_name} ${replyData.user.last_name}`,
            avatar: '/assets/images/txt_img.png',
            text: replyData.content,
            likes: replyData.reactions_count || 0,
            liked: replyData.my_reaction ? true : false,
            myReaction: replyData.my_reaction,
            time: replyData.created_at,
          })) : []
        }));
        setComments(mapped);
      }
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const response = await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: newCommentText
        })
      });

      if (response.ok) {
        setNewCommentText('');
        if (onCommentAdded) {
          onCommentAdded();
        }
        loadComments();
      } else {
        alert("Failed to add comment.");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  const [pickerOpen, setPickerOpen] = useState({});
  const [modalCommentId, setModalCommentId] = useState(null);

  const reactionsList = [
    { type: 'like', label: 'Like', color: '#377DFF' },
    { type: 'love', label: 'Love', color: '#F33A5E' },
    { type: 'haha', label: 'Haha', color: '#FFCC4D' },
    { type: 'wow', label: 'Wow', color: '#FFCC4D' },
    { type: 'sad', label: 'Sad', color: '#FFCC4D' },
    { type: 'angry', label: 'Angry', color: '#F7583B' }
  ];

  const renderReactionIcon = (type, size = 16, strokeColor = null) => {
    if (type === 'like') {
      return (
        <span className="_reaction_like" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor || '#377DFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
        </span>
      );
    }
    if (type === 'love') {
      return (
        <span className="_reaction_heart" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor || 'red'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </span>
      );
    }
    const emojiMap = {
      haha: '😆',
      wow: '😮',
      sad: '😢',
      angry: '😡'
    };
    return <span style={{ fontSize: `${size + 2}px`, lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>{emojiMap[type] || ''}</span>;
  };

  const handleLikeComment = async (id, reactionType = 'like') => {
    try {
      const response = await apiRequest(`/api/comments/${id}/react`, {
        method: 'POST',
        body: JSON.stringify({
          reaction_type: reactionType
        })
      });
      if (response.ok) {
        const result = await response.json();
        const isRegistered = result.message === 'Reaction registered';
        const reactionTypeRegistered = isRegistered ? reactionType : null;

        setComments(prevComments => prevComments.map(c => {
          if (c.id === id) {
            let newLikes = c.likes;
            if (isRegistered) {
              if (!c.myReaction) {
                newLikes += 1;
              }
            } else {
              newLikes = Math.max(0, newLikes - 1);
            }
            return {
              ...c,
              liked: isRegistered,
              myReaction: reactionTypeRegistered,
              likes: newLikes
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: c.replies.map(r => {
                if (r.id === id) {
                  let newLikes = r.likes;
                  if (isRegistered) {
                    if (!r.myReaction) {
                      newLikes += 1;
                    }
                  } else {
                    newLikes = Math.max(0, newLikes - 1);
                  }
                  return {
                    ...r,
                    liked: isRegistered,
                    myReaction: reactionTypeRegistered,
                    likes: newLikes
                  };
                }
                return r;
              })
            };
          }
          return c;
        }));
      }
    } catch (err) {
      console.error("Failed to react to comment:", err);
    }
  };

  const toggleReplyBox = (id) => {
    setReplyBoxes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddReply = async (e, commentId) => {
    e.preventDefault();
    const replyText = replyTexts[commentId];
    if (!replyText || !replyText.trim()) return;

    try {
      const response = await apiRequest(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: replyText,
          parent_id: commentId
        })
      });
      if (response.ok) {
        setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
        toggleReplyBox(commentId);
        if (onCommentAdded) {
          onCommentAdded();
        }
        loadComments();
      } else {
        alert("Failed to add reply.");
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    }
  };

  return (
    <div className="_feed_inner_timeline_cooment_area">
      {/* Add Main Comment Box */}
      <div className="_feed_inner_comment_box">
        <form className="_feed_inner_comment_box_form" onSubmit={handleAddComment}>
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              <img src="/assets/images/txt_img.png" alt="" className="_comment_img" />
            </div>
            <div className="_feed_inner_comment_box_content_txt">
              <textarea 
                className="form-control _comment_textarea" 
                placeholder="Write a comment..." 
                id={`floatingTextarea2-${postId}`}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    handleAddComment(e);
                  }
                }}
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <div className="_timline_comment_main">
        {/* Current list of comments */}
        {comments.map((comment) => (
          <div className="_comment_main" key={comment.id}>
            <div className="_comment_image">
              <Link to="#" className="_comment_image_link">
                <img src={comment.avatar} alt="" className="_comment_img1" />
              </Link>
            </div>
            <div className="_comment_area">
              <div className="_comment_details">
                <div className="_comment_details_top">
                  <div className="_comment_name">
                    <Link to="#">
                      <h4 className="_comment_name_title">{comment.author}</h4>
                    </Link>
                  </div>
                </div>
                <div className="_comment_status">
                  <p className="_comment_status_text"><span>{comment.text}</span></p>
                </div>
                {comment.likes > 0 && (
                  <div className="_total_reactions" onClick={() => setModalCommentId(comment.id)} style={{ cursor: 'pointer' }}>
                    <div className="_total_react">
                      <span className="_reaction_like">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      </span>
                      <span className="_reaction_heart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                      </span>
                    </div>
                    <span className="_total">{comment.likes}</span>
                  </div>
                )}
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <ul className="_comment_reply_list">
                      <li
                        onMouseEnter={() => setPickerOpen(prev => ({ ...prev, [comment.id]: true }))}
                        onMouseLeave={() => setPickerOpen(prev => ({ ...prev, [comment.id]: false }))}
                        style={{ position: 'relative', overflow: 'visible' }}
                      >
                        {pickerOpen[comment.id] && (
                          <div 
                            className="_reaction_picker_popover" 
                            style={{
                              position: 'absolute',
                              bottom: '100%',
                              left: '0',
                              background: '#fff',
                              borderRadius: '30px',
                              padding: '8px 16px',
                              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                              display: 'flex',
                              gap: '12px',
                              zIndex: 1000,
                              cursor: 'default',
                              alignItems: 'center'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {reactionsList.map(item => (
                              <span 
                                key={item.type}
                                style={{ 
                                  cursor: 'pointer',
                                  transition: 'transform 0.1s ease',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeComment(comment.id, item.type);
                                  setPickerOpen(prev => ({ ...prev, [comment.id]: false }));
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                title={item.label}
                              >
                                {renderReactionIcon(item.type, 18)}
                              </span>
                            ))}
                          </div>
                        )}
                        <span 
                          onClick={() => handleLikeComment(comment.id, comment.myReaction ? comment.myReaction : 'like')} 
                          style={{ 
                            cursor: 'pointer', 
                            color: comment.myReaction ? reactionsList.find(r => r.type === comment.myReaction)?.color : 'inherit', 
                            fontWeight: comment.myReaction ? '600' : 'normal',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          {comment.myReaction && (
                            <span style={{ marginRight: '4px', display: 'inline-flex', alignItems: 'center' }}>
                              {renderReactionIcon(comment.myReaction, 13, reactionsList.find(r => r.type === comment.myReaction)?.color)}
                            </span>
                          )}
                          {comment.myReaction ? reactionsList.find(r => r.type === comment.myReaction)?.label : 'Like.'}
                        </span>
                      </li>
                      <li><span onClick={() => toggleReplyBox(comment.id)} style={{ cursor: 'pointer' }}>Reply.</span></li>
                      <li><span>Share</span></li>
                      <li><span className="_time_link">.{formatRelativeTime(comment.time, true)}</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Nested Replies List */}
              {comment.replies && comment.replies.map((reply) => (
                <div className="_comment_main" key={reply.id} style={{ marginLeft: '40px', marginTop: '10px' }}>
                  <div className="_comment_image">
                    <Link to="#" className="_comment_image_link">
                      <img src={reply.avatar} alt="" className="_comment_img1" />
                    </Link>
                  </div>
                  <div className="_comment_area">
                    <div className="_comment_details">
                      <div className="_comment_details_top">
                        <div className="_comment_name">
                          <Link to="#">
                            <h4 className="_comment_name_title">{reply.author}</h4>
                          </Link>
                        </div>
                      </div>
                      <div className="_comment_status">
                        <p className="_comment_status_text"><span>{reply.text}</span></p>
                      </div>
                      {reply.likes > 0 && (
                        <div className="_total_reactions" onClick={() => setModalCommentId(reply.id)} style={{ cursor: 'pointer' }}>
                          <div className="_total_react">
                            <span className="_reaction_like">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            </span>
                            <span className="_reaction_heart">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            </span>
                          </div>
                          <span className="_total">{reply.likes}</span>
                        </div>
                      )}
                      <div className="_comment_reply">
                        <div className="_comment_reply_num">
                          <ul className="_comment_reply_list">
                            <li
                              onMouseEnter={() => setPickerOpen(prev => ({ ...prev, [reply.id]: true }))}
                              onMouseLeave={() => setPickerOpen(prev => ({ ...prev, [reply.id]: false }))}
                              style={{ position: 'relative', overflow: 'visible' }}
                            >
                              {pickerOpen[reply.id] && (
                                <div 
                                  className="_reaction_picker_popover" 
                                  style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '0',
                                    background: '#fff',
                                    borderRadius: '30px',
                                    padding: '8px 16px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    gap: '12px',
                                    zIndex: 1000,
                                    cursor: 'default',
                                    alignItems: 'center'
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {reactionsList.map(item => (
                                    <span 
                                      key={item.type}
                                      style={{ 
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s ease',
                                        display: 'inline-flex',
                                        alignItems: 'center'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleLikeComment(reply.id, item.type);
                                        setPickerOpen(prev => ({ ...prev, [reply.id]: false }));
                                      }}
                                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                      title={item.label}
                                    >
                                      {renderReactionIcon(item.type, 18)}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span 
                                onClick={() => handleLikeComment(reply.id, reply.myReaction ? reply.myReaction : 'like')} 
                                style={{ 
                                  cursor: 'pointer', 
                                  color: reply.myReaction ? reactionsList.find(r => r.type === reply.myReaction)?.color : 'inherit', 
                                  fontWeight: reply.myReaction ? '600' : 'normal',
                                  display: 'inline-flex',
                                  alignItems: 'center'
                                }}
                              >
                                {reply.myReaction && (
                                  <span style={{ marginRight: '4px', display: 'inline-flex', alignItems: 'center' }}>
                                    {renderReactionIcon(reply.myReaction, 11, reactionsList.find(r => r.type === reply.myReaction)?.color)}
                                  </span>
                                )}
                                {reply.myReaction ? reactionsList.find(r => r.type === reply.myReaction)?.label : 'Like.'}
                              </span>
                            </li>
                            <li><span onClick={() => toggleReplyBox(comment.id)} style={{ cursor: 'pointer' }}>Reply.</span></li>
                            <li><span>Share</span></li>
                            <li><span className="_time_link">.{formatRelativeTime(reply.time, true)}</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Toggleable nested reply input field */}
              {replyBoxes[comment.id] && (
                <div className="_feed_inner_comment_box mt-2" style={{ paddingLeft: '40px' }}>
                  <form className="_feed_inner_comment_box_form" onSubmit={(e) => handleAddReply(e, comment.id)}>
                    <div className="_feed_inner_comment_box_content">
                      <div className="_feed_inner_comment_box_content_image">
                        <img src="/assets/images/txt_img.png" alt="" className="_comment_img" />
                      </div>
                      <div className="_feed_inner_comment_box_content_txt">
                        <textarea 
                          className="form-control _comment_textarea" 
                          placeholder="Write a reply..." 
                          id={`floatingTextareaReply-${comment.id}`}
                          value={replyTexts[comment.id] || ''}
                          onChange={(e) => setReplyTexts(prev => ({ ...prev, [comment.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              handleAddReply(e, comment.id);
                            }
                          }}
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {modalCommentId && (
        <ReactionsModal 
          commentId={modalCommentId} 
          onClose={() => setModalCommentId(null)} 
        />
      )}
    </div>
  );
}
