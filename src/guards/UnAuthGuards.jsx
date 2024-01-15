import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const UnAuthGuard = ({ component }) => {
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
                localStorage.removeItem("token")
            } else {
                navigate(`/`);
            }
            setStatus(true);
        } catch (error) {
            navigate(`/`);
        }
    }

    return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default UnAuthGuard;