import React, { useState } from 'react';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';

export default function FeedPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Karim Saif',
      authorImg: '/assets/images/post_img.png',
      timeAgo: '5 minute ago',
      title: '-Healthy Tracking App',
      image: '/assets/images/timeline_img.png',
      reactionsCount: 9
    },
    {
      id: 2,
      author: 'Karim Saif',
      authorImg: '/assets/images/post_img.png',
      timeAgo: '1 hour ago',
      title: 'Excited to show our new workspace setup!',
      image: '/assets/images/timeline_img.png',
      reactionsCount: 23
    }
  ]);

  const handleAddPost = (text) => {
    const newPost = {
      id: Date.now(),
      author: 'Dylan Field',
      authorImg: '/assets/images/profile.png',
      timeAgo: 'Just now',
      title: text,
      image: null,
      reactionsCount: 0
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(p => p.id !== id));
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
                {posts.map(post => (
                  <Post 
                    key={post.id} 
                    post={post} 
                    onDelete={handleDeletePost}
                  />
                ))}
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
