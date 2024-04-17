import "@/styles/globals.css";
import { useEffect, useState } from 'react';
import { UserProvider, useAuth, useUserData } from '../components/AuthContext';

export default function App({ Component, pageProps }) {
  const currentUser = useAuth();
  const userData = useUserData(currentUser?.uid);

  return(
    <UserProvider user={{ currentUser, userData }}>
      <Component {...pageProps} />
    </UserProvider>
    // <Component {...pageProps} />;
  ) 
}
