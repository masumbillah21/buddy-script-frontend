import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from './CommentSection';
import { apiRequest } from '../services/api';
import { formatRelativeTime } from '../utils/time';

export default function Post({ post, onDelete }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reactions, setReactions] = useState(post.reactionsCount || 0);
  const [myReaction, setMyReaction] = useState(post.myReaction || null);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  React.useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    window.addEventListener('click', closeDropdown);
    return () => window.removeEventListener('click', closeDropdown);
  }, []);

  const [pickerOpen, setPickerOpen] = useState(false);

  const reactionsList = [
    { type: 'like', label: 'Like', emoji: '👍', color: '#377DFF' },
    { type: 'love', label: 'Love', emoji: '❤️', color: '#F33A5E' },
    { type: 'haha', label: 'Haha', emoji: '😆', color: '#FFCC4D' },
    { type: 'wow', label: 'Wow', emoji: '😮', color: '#FFCC4D' },
    { type: 'sad', label: 'Sad', emoji: '😢', color: '#FFCC4D' },
    { type: 'angry', label: 'Angry', emoji: '😡', color: '#F7583B' }
  ];

  const handleSelectReaction = async (type) => {
    try {
      const response = await apiRequest(`/api/posts/${post.id}/react`, {
        method: 'POST',
        body: JSON.stringify({
          reaction_type: type
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.message === 'Reaction registered') {
          setReactions(prev => prev + (myReaction ? 0 : 1));
          setMyReaction(type);
        } else {
          setReactions(prev => Math.max(0, prev - 1));
          setMyReaction(null);
        }
      }
    } catch (err) {
      console.error("Reaction selection failed:", err);
    }
  };

  const handleReactClick = () => {
    if (myReaction) {
      handleSelectReaction(myReaction);
    } else {
      handleSelectReaction('like');
    }
  };

  const getReactionAvatars = () => {
    const list = [];
    if (myReaction) {
      list.push('/assets/images/profile.png');
    }
    const defaultAvatars = [
      '/assets/images/txt_img.png',
      '/assets/images/comment_img.png',
      '/assets/images/react_img3.png',
      '/assets/images/react_img4.png'
    ];
    const needed = reactions - (myReaction ? 1 : 0);
    for (let i = 0; i < Math.min(needed, 4); i++) {
      list.push(defaultAvatars[i % defaultAvatars.length]);
    }
    return list.slice(0, 4);
  };

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        {/* Post Top Header */}
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <img src={post.authorImg || "/assets/images/post_img.png"} alt="" className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{post.author || "Karim Saif"}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {formatRelativeTime(post.createdAt)} . <Link to="#">Public</Link>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown" style={{ position: 'relative' }}>
            <div className="_feed_timeline_post_dropdown">
              <button 
                id="_timeline_show_drop_btn" 
                className="_feed_timeline_post_dropdown_link"
                onClick={toggleDropdown}
                style={{ border: 'none', background: 'none' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
            
            {/* Dropdown Menu */}
            <div 
              className={`_feed_timeline_dropdown _timeline_dropdown ${dropdownOpen ? 'show' : ''}`}
              onClick={(e) => e.stopPropagation()}
              style={{ right: 0, top: '25px', left: 'auto' }}
            >
              <ul className="_feed_timeline_dropdown_list">
                <li className="_feed_timeline_dropdown_item">
                  <Link to="#" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z"/>
                      </svg>															  
                    </span>
                    Save Post	
                  </Link>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <Link to="#" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                        <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd"/>
                      </svg>										
                    </span>
                    Turn On Notification 
                  </Link>
                </li>
                <li className="_feed_timeline_dropdown_item">
                  <Link to="#" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5"/>
                      </svg>										
                    </span>
                    Hide	
                  </Link>
                </li>
                <li className="_feed_timeline_dropdown_item" onClick={() => alert("Edit post functionality - local edit")}>
                  <Link to="#" className="_feed_timeline_dropdown_link">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75"/>
                        <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z"/>
                      </svg>									
                    </span>
                    Edit Post	
                  </Link>
                </li>
                <li 
                  className="_feed_timeline_dropdown_item"
                  onClick={() => onDelete(post.id)}
                >
                  <Link to="#" className="_feed_timeline_dropdown_link" style={{ color: '#ff4d4f' }}>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                        <path stroke="#ff4d4f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5"/>
                      </svg>										
                    </span>
                    Delete Post	
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Post Title */}
        <h4 className="_feed_inner_timeline_post_title">{post.title || "-Healthy Tracking App"}</h4>
        
        {/* Post Image */}
        {post.image && (
          <div className="_feed_inner_timeline_image">
            <img src={post.image} alt="" className="_time_img" />
          </div>
        )}
      </div>

      {/* Post React Count Info */}
      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        {reactions > 0 && (
          <div className="_feed_inner_timeline_total_reacts_image">
            {getReactionAvatars().map((imgSrc, idx) => (
              <img 
                key={idx}
                src={imgSrc} 
                alt="User" 
                className={idx === 0 ? '_react_img1' : '_react_img'} 
              />
            ))}
            <p className="_feed_inner_timeline_total_reacts_para">
              {reactions === 1 ? '1' : `${reactions}+`}
            </p>
          </div>
        )}
        <div className="_feed_inner_timeline_total_reacts_txt" style={{ marginLeft: 'auto' }}>
          <p className="_feed_inner_timeline_total_reacts_para1">
            <Link to="#"><span>{commentsCount}</span> Comments</Link>
          </p>
          <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Shares</p>
        </div>
      </div>

      {/* Post Actions Button Group */}
      <div className="_feed_inner_timeline_reaction">
        <button 
          className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${myReaction ? '_feed_reaction_active' : ''}`}
          onClick={handleReactClick}
          onMouseEnter={() => setPickerOpen(true)}
          onMouseLeave={() => setPickerOpen(false)}
          style={{ position: 'relative', overflow: 'visible', border: 'none', background: 'none' }}
        >
          {pickerOpen && (
            <div 
              className="_reaction_picker_popover" 
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '0',
                background: '#fff',
                borderRadius: '30px',
                padding: '6px 12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                gap: '12px',
                zIndex: 1000,
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {reactionsList.map(item => (
                <span 
                  key={item.type}
                  style={{ 
                    fontSize: '22px', 
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                    display: 'inline-block'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectReaction(item.type);
                    setPickerOpen(false);
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  title={item.label}
                >
                  {item.emoji}
                </span>
              ))}
            </div>
          )}
          
          <span className="_feed_inner_timeline_reaction_link"> 
            {myReaction ? (
              <span style={{ color: reactionsList.find(r => r.type === myReaction)?.color }}>
                <span style={{ marginRight: '6px', fontSize: '16px' }}>
                  {reactionsList.find(r => r.type === myReaction)?.emoji}
                </span>
                {reactionsList.find(r => r.type === myReaction)?.label}
              </span>
            ) : (
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up" style={{ marginRight: '6px', stroke: '#666' }}>
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                Like
              </span>
            )}
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link"> 
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"/>
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563"/>
              </svg>                                                      
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link"> 
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"/>
              </svg>                                                 
              Share
            </span>
          </span>
        </button>
      </div>

      {/* Comments section */}
      <CommentSection postId={post.id} onCommentAdded={() => setCommentsCount(prev => prev + 1)} />
    </div>
  );
}
