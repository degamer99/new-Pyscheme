// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './Firebase'; // Update this with your Firebase config

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };


import { useEffect, useState, createContext, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebase';

export const useAuth = async () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("user", user)
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    return currentUser;
};

// export default useAuth;

export const useUserData = () => {
    const [userData, setUserData] = useState(null);
    const [uid, setUid] = useState(null);
   
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("user2", user)
                const userRef = doc(firestore, 'users', user.uid); // Assuming 'users' is your collection name
                setUid(user.uid);
                fetchUserData(userRef);
            } else {
                console.log("No User Found")
            }
        })
        const fetchUserData = async (userRef) => {
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                console.log("data", docSnap.data())
                setUserData(docSnap.data());
            } else {
                console.log('No such document!');
            }
        };
        
    }, [uid])

    return userData;
};




export const UserContext = createContext();

export const UserProvider = ({ children, user }) => {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return useContext(UserContext);
};
