'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { doc, getFirestore, setDoc, getDocs, query, collection, where, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { HiSearch } from "react-icons/hi";
import app from './../Shared/firebaseConfig';
import { useRouter } from 'next/navigation';
import image from '../../public/WhatsApp_Image_2024-10-18_at_2.53.56_PM-removebg-preview.png';
import img from '../../public/Add Square.svg';

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const db = getFirestore(app);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useEffect(() => {
    if (session?.user) {
      saveUserInfo();
      fetchFollowingList(session.user.email); 
    }
  }, [session]);

  const saveUserInfo = async () => {
    if (session?.user) {
      const userDocRef = doc(db, "user", session.user.email);
      const docSnap = await getDoc(userDocRef);

      const userData = {
        userName: session.user.name,
        email: session.user.email,
        userImage: session.user.image,
        following: docSnap.exists() && docSnap.data().following ? docSnap.data().following : [], 
        follower: docSnap.exists() && docSnap.data().follower ? docSnap.data().follower : []    
      };

      await setDoc(userDocRef, userData, { merge: true }); 
    }
  };

  const fetchFollowingList = async (userEmail) => {
    try {
      const userDocRef = doc(db, "user", userEmail);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const following = docSnap.data().following || [];
        setFollowingList(following); 
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching following list: ", error);
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      const q = query(collection(db, "user"), where("userName", "==", searchQuery));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      setSearchResults(results);
    }
  };

  const handleFollow = async (targetEmail) => {
    if (session?.user) {
      const userDocRef = doc(db, "user", session.user.email);

      if (!followingList.includes(targetEmail)) {
        await updateDoc(userDocRef, {
          following: arrayUnion(targetEmail)
        });
        setFollowingList(prev => [...prev, targetEmail]);
      } else {
        await updateDoc(userDocRef, {
          following: arrayRemove(targetEmail)
        });
        setFollowingList(prev => prev.filter(email => email !== targetEmail)); 
      }
    } else {
      signIn();
    }
  };

  const onCreateClick = () => {
    if (session) {
      router.push('/pin-builder');
    } else {
      signIn();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='flex justify-between gap-3 md:gap-2 items-center p-3 bg-[#242427]'>
      <Image src={image} alt='logo'
        width={120} height={110} onClick={() => router.push('/')}
        className='hover:bg-gray-300 p-2 rounded-full cursor-pointer' />

      <div className='bg-[#e9e9e9] p-3 px-6 gap-3 items-center rounded-full w-50 hidden md:flex h-12'>
        <HiSearch className='text-[30px] text-gray-500 ' />
        <input
          type="text"
          placeholder='Search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} 
          className='bg-transparent outline-none w-full text-[20px]' 
        />
        <button onClick={handleSearch} aria-label="Perform search">
          <Image src={image} width={30} height={30} className="p-2 px-4" alt="Search" />
        </button>
        
      </div>

      {searchResults.length > 0 && (
        <div className="search-results p-3 bg-[#D0D0D0]">
          {searchResults.map((result, index) => (
            <div key={index} className="result-item flex items-center justify-between p-2 bg-[#D0D0D0]">
              <div className="flex items-center">
                <Image src={result.userImage} alt="user-image" className='rounded-full' width={50} height={50} />
                <div className="ml-3 bg-[#D0D0D0]">
                  <p>{result.userName}</p>
                  <p>{result.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleFollow(result.email)}
                className={`p-2 px-4 rounded-full ${followingList.includes(result.email) ? 'bg-red-500' : 'bg-green-500'} text-white`}
              >
                {followingList.includes(result.email) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex p-2">
        <button className='bg-[#242427] text-white p-3 px-6 rounded-full text-[20px] hidden md:block' onClick={() => router.push('/')}>Home</button>

        <Image src={img} alt='add' className='hover:bg-gray-300 p-3 cursor-pointer' width={60} height={60} onClick={() => onCreateClick()} />

        {session?.user ?
          <Image src={session.user.image}
            onClick={() => router.push('/' + session.user.email)}
            alt='user-image' width={60} height={60}
            className='hover:bg-gray-300 p-2 rounded-full cursor-pointer' /> :

          <button className='font-semibold p-2 px-4 rounded-full' onClick={() => signIn()}>Login</button>}
      </div>
    </div>
  );
}

export default Header;
