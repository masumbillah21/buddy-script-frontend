import React, { useState, useEffect } from 'react';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { apiRequest } from '../services/api';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      const response = await apiRequest('/api/posts');
      if (response.ok) {
        const result = await response.json();
        const mapped = result.data.map(postData => ({
          id: postData.id,
          author: `${postData.user.first_name} ${postData.user.last_name}`,
          authorImg: '/assets/images/profile.png',
          createdAt: postData.created_at,
          content: postData.content,
          image: postData.image_path,
          video: postData.video_path,
          postTitle: postData.title,
          type: postData.type,
          eventDate: postData.event_date,
          visibility: postData.visibility,
          reactionsCount: postData.reactions_count || 0,
          commentsCount: postData.comments_count || 0,
          myReaction: postData.my_reaction
        }));
        setPosts(mapped);
      }
    } catch (err) {
      console.error("Failed to load posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleAddPost = async (postPayload) => {
    try {
      let body;
      if (postPayload && typeof postPayload === 'object') {
        if (postPayload.imageFile || postPayload.videoFile) {
          body = new FormData();
          body.append('content', postPayload.content || '');
          body.append('type', postPayload.type || 'text');
          body.append('visibility', postPayload.visibility || 'public');
          if (postPayload.title) body.append('title', postPayload.title);
          if (postPayload.event_date) body.append('event_date', postPayload.event_date);

          if (postPayload.imageFile) {
            body.append('image', postPayload.imageFile);
          }
          if (postPayload.videoFile) {
            body.append('video', postPayload.videoFile);
          }
        } else {
          body = JSON.stringify(postPayload);
        }
      } else {
        body = JSON.stringify({
          content: postPayload,
          visibility: 'public'
        });
      }

      const response = await apiRequest('/api/posts', {
        method: 'POST',
        body: body
      });
      if (response.ok) {
        const result = await response.json();
        const postData = result.data;
        const mappedPost = {
          id: postData.id,
          author: `${postData.user.first_name} ${postData.user.last_name}`,
          authorImg: '/assets/images/profile.png',
          createdAt: postData.created_at,
          content: postData.content,
          image: postData.image_path,
          video: postData.video_path,
          postTitle: postData.title,
          type: postData.type,
          eventDate: postData.event_date,
          visibility: postData.visibility,
          reactionsCount: postData.reactions_count || 0,
          commentsCount: postData.comments_count || 0,
          myReaction: postData.my_reaction
        };
        setPosts(prevPosts => [mappedPost, ...prevPosts]);
      } else {
        try {
          const errorData = await response.json();
          alert(errorData.message || "Failed to publish post.");
        } catch (e) {
          alert("Failed to publish post.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await apiRequest(`/api/posts/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete post.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting post.");
    }
  };

  return (
    <div className="container _custom_container">
      <div className="_layout_inner_wrap">
        <div className="row">
          {/* Left Column Sidebar */}
          <SidebarLeft />

          {/* Middle Column Content */}
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <div className="_layout_middle_wrap">
              <div className="_layout_middle_inner">
                {/* Story Slider Cards */}
                <Stories />

                {/* Create Post Textbox */}
                <CreatePost onAddPost={handleAddPost} />

                {/* Feed Posts */}
                {loading ? (
                  <div className="text-center _mar_t20">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center _mar_t20 text-muted">No posts available. Be the first to write something!</div>
                ) : (
                  posts.map(post => (
                    <Post
                      key={post.id}
                      post={post}
                      onDelete={handleDeletePost}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column Sidebar */}
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}
