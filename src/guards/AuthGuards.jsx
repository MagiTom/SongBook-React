import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const AuthGuard = ({ component }) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      checkToken(user);
    });
    // eslint-disable-next-line
  }, [component]);

  const checkToken = async (user) => {
    try {
      if (!user) {
        navigate(`/login`);
      }
      setStatus(true);
      return;
    } catch (error) {
      navigate(`/login`);
    }
  }

  return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default AuthGuard;