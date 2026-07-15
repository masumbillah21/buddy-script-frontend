import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarRight() {
  const [showYouMightLike, setShowYouMightLike] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [friends] = useState([
    { id: 1, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', active: false, time: '5 minute ago' },
    { id: 2, name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', active: true },
    { id: 3, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', active: true },
    { id: 4, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', active: false, time: '5 minute ago' },
    { id: 5, name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', active: true },
    { id: 6, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', active: true },
    { id: 7, name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', active: true },
    { id: 8, name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', active: false, time: '5 minute ago' }
  ]);

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
      <div className="_layout_right_sidebar_wrap">
        {/* You Might Like Widget */}
        {showYouMightLike && (
          <div className="_layout_right_sidebar_inner">
            <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
              <div className="_right_inner_area_info_content _mar_b24">
                <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                <span className="_right_inner_area_info_content_txt">
                  <Link className="_right_inner_area_info_content_txt_link" to="#">See All</Link>
                </span>
              </div>
              <hr className="_underline" />
              <div className="_right_inner_area_info_ppl">
                <div className="_right_inner_area_info_box">
                  <div className="_right_inner_area_info_box_image">
                    <Link to="#">
                      <img src="/assets/images/Avatar.png" alt="User" className="_ppl_img" />
                    </Link>
                  </div>
                  <div className="_right_inner_area_info_box_txt">
                    <Link to="#">
                      <h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4>
                    </Link>
                    <p className="_right_inner_area_info_box_para">Founder & CEO at Trophy</p>
                  </div>
                </div>
                <div className="_right_info_btn_grp">
                  <button 
                    type="button" 
                    className="_right_info_btn_link"
                    onClick={() => setShowYouMightLike(false)}
                  >
                    Ignore
                  </button>
                  <button 
                    type="button" 
                    className={`_right_info_btn_link ${followed ? '' : '_right_info_btn_link_active'}`}
                    onClick={() => setFollowed(!followed)}
                  >
                    {followed ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Friends Widget */}
        <div className="_layout_right_sidebar_inner">
          <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
            <div className="_feed_top_fixed">
              <div className="_feed_right_inner_area_card_content _mar_b24">
                <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                <span className="_feed_right_inner_area_card_content_txt">
                  <Link className="_feed_right_inner_area_card_content_txt_link" to="#">See All</Link>
                </span>
              </div>
              <form className="_feed_right_inner_area_card_form" onSubmit={(e) => e.preventDefault()}>
                <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                  <circle cx="7" cy="7" r="6" stroke="#666"></circle>
                  <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3"></path>
                </svg>
                <input 
                  className="form-control me-2 _feed_right_inner_area_card_form_inpt" 
                  type="search" 
                  placeholder="input search text" 
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            <div className="_feed_bottom_fixed" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredFriends.length > 0 ? (
                filteredFriends.map((f, idx) => (
                  <div 
                    className={`_feed_right_inner_area_card_ppl ${f.active ? '' : '_feed_right_inner_area_card_ppl_inactive'}`}
                    key={idx}
                  >
                    <div className="_feed_right_inner_area_card_ppl_box">
                      <div className="_feed_right_inner_area_card_ppl_image">
                        <Link to="#">
                          <img src={f.img} alt="" className="_box_ppl_img" />
                        </Link>
                      </div>
                      <div className="_feed_right_inner_area_card_ppl_txt">
                        <Link to="#">
                          <h4 className="_feed_right_inner_area_card_ppl_title">{f.name}</h4>
                        </Link>
                        <p className="_feed_right_inner_area_card_ppl_para">{f.role}</p>
                      </div>
                    </div>
                    {f.active ? (
                      <div className="_feed_right_inner_area_card_ppl_side">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                          <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                        </svg>
                      </div>
                    ) : (
                      <div className="_feed_right_inner_area_card_ppl_side"> 
                        <span>{f.time}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px 0', color: '#666', textAlign: 'center' }}>No friends found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
