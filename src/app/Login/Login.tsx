'use client';

import React from "react";
import "./Login.css";

const Login: React.FC = () => {
  return (
    <>
      {/* Trigger button - you can move this to Header */}
      <button
        className="btn btn-outline-primary login-btn"
        data-bs-toggle="modal"
        data-bs-target="#loginModal"
      >
        Login
      </button>

      {/* Login Modal */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content login-panel">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Welcome Back</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 text-start">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <p className="text-center mt-3 small">
                Don’t have an account? <a href="#">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
