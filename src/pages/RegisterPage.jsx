import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== repeatPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await apiRequest('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password
        })
      });

      const data = await response.json();
      if (response.ok) {
        showToast("Registration successful! Please log in.");
        navigate('/login');
      } else {
        if (data.errors) {
          const firstErr = Object.values(data.errors)[0][0];
          setError(firstErr);
        } else {
          setError(data.message || "Registration failed.");
        }
      }
    } catch (err) {
      setError("Failed to connect to the backend server.");
    }
  };

  return (
    <section className="_social_registration_wrapper _layout_main_wrapper">
      <div className="_shape_one">
        <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape.svg" alt="" className="_dark_shape" />
      </div>
      <div className="_shape_two">
        <img src="/assets/images/shape2.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_shape_three">
        <img src="/assets/images/shape3.svg" alt="" className="_shape_img" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="_dark_shape _dark_shape_opacity" />
      </div>
      <div className="_social_registration_wrap">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="_social_registration_right">
                <div className="_social_registration_right_image">
                  <img src="/assets/images/registration.png" alt="Illustration" />
                </div>
                <div className="_social_registration_right_image_dark">
                  <img src="/assets/images/registration1.png" alt="Illustration" />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="_social_registration_content">
                <div className="_social_registration_right_logo _mar_b28">
                  <img src="/assets/images/logo.svg" alt="Illustration" className="_right_logo" />
                </div>
                <p className="_social_registration_content_para _mar_b8">Get Started Now</p>
                <h4 className="_social_registration_content_title _titl4 _mar_b50">Registration</h4>
                
                {error && (
                  <div className="alert alert-danger _mar_b20" style={{ padding: '10px 15px', borderRadius: '8px', fontSize: '14px' }}>
                    {error}
                  </div>
                )}
                
                <button 
                  type="button" 
                  className="_social_registration_content_btn _mar_b40"
                  onClick={() => navigate('/')}
                >
                  <img src="/assets/images/google.svg" alt="Illustration" className="_google_img" /> 
                  <span>Register with google</span>
                </button>
                
                <div className="_social_registration_content_bottom_txt _mar_b40">
                  <span>Or</span>
                </div>
                
                <form className="_social_registration_form" onSubmit={handleRegister}>
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">First Name</label>
                        <input 
                          type="text" 
                          className="form-control _social_registration_input" 
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Last Name</label>
                        <input 
                          type="text" 
                          className="form-control _social_registration_input" 
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Email</label>
                        <input 
                          type="email" 
                          className="form-control _social_registration_input" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Password</label>
                        <input 
                          type="password" 
                          className="form-control _social_registration_input" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="_social_registration_form_input _mar_b14">
                        <label className="_social_registration_label _mar_b8">Repeat Password</label>
                        <input 
                          type="password" 
                          className="form-control _social_registration_input" 
                          required
                          value={repeatPassword}
                          onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12">
                      <div className="form-check _social_registration_form_check">
                        <input className="form-check-input _social_registration_form_check_input" type="checkbox" id="termsCheck" required defaultChecked />
                        <label className="form-check-label _social_registration_form_check_label" htmlFor="termsCheck">
                          I agree to terms & conditions
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-xl-12 col-sm-12">
                      <div className="_social_registration_form_btn _mar_t40 _mar_b60">
                        <button type="submit" className="_social_registration_form_btn_link _btn1">Register now</button>
                      </div>
                    </div>
                  </div>
                </form>
                
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_social_registration_bottom_txt">
                      <p className="_social_registration_bottom_txt_para">
                        Already have an account? <Link to="/login">Login now</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
