import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { formatRelativeTime } from '../utils/time';

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
          time: commentData.created_at,
          replies: commentData.replies ? commentData.replies.map(replyData => ({
            id: replyData.id,
            author: `${replyData.user.first_name} ${replyData.user.last_name}`,
            avatar: '/assets/images/txt_img.png',
            text: replyData.content,
            likes: replyData.reactions_count || 0,
            liked: replyData.my_reaction ? true : false,
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

  const handleLikeComment = async (id) => {
    try {
      const response = await apiRequest(`/api/comments/${id}/react`, {
        method: 'POST',
        body: JSON.stringify({
          reaction_type: 'like'
        })
      });
      if (response.ok) {
        const result = await response.json();
        const isRegistered = result.message === 'Reaction registered';
        setComments(prevComments => prevComments.map(c => {
          if (c.id === id) {
            return {
              ...c,
              liked: isRegistered,
              likes: isRegistered ? c.likes + 1 : Math.max(0, c.likes - 1)
            };
          }
          if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: c.replies.map(r => {
                if (r.id === id) {
                  return {
                    ...r,
                    liked: isRegistered,
                    likes: isRegistered ? r.likes + 1 : Math.max(0, r.likes - 1)
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
                <div className="_total_reactions">
                  <div className="_total_react">
                    <span className="_reaction_like">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </span>
                  </div>
                  <span className="_total">{comment.likes}</span>
                </div>
                <div className="_comment_reply">
                  <div className="_comment_reply_num">
                    <ul className="_comment_reply_list">
                      <li>
                        <span 
                          onClick={() => handleLikeComment(comment.id)} 
                          style={{ cursor: 'pointer', color: comment.liked ? '#377DFF' : 'inherit', fontWeight: comment.liked ? '600' : 'normal' }}
                        >
                          Like.
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
                      <div className="_total_reactions">
                        <div className="_total_react">
                          <span className="_reaction_like">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up">
                              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                            </svg>
                          </span>
                        </div>
                        <span className="_total">{reply.likes}</span>
                      </div>
                      <div className="_comment_reply">
                        <div className="_comment_reply_num">
                          <ul className="_comment_reply_list">
                            <li>
                              <span 
                                onClick={() => handleLikeComment(reply.id)} 
                                style={{ cursor: 'pointer', color: reply.liked ? '#377DFF' : 'inherit', fontWeight: reply.liked ? '600' : 'normal' }}
                              >
                                Like.
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
    </div>
  );
}
