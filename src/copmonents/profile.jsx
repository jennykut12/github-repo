import React, { useEffect, useState } from "react";
import ProfileImg from "../assets/jenniferimgbg.png";
import { FaShareSquare } from "react-icons/fa";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [avatar, setAvatar] = useState({});

  const url = "https://api.github.com/users/jennykut12";
  const token = process.env.REACT_APP_GITHUB_TOKEN;
  const getUser = async () => {
    const user = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await user.json();
    console.log(response);
    setUserProfile(response);
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className=" w-[50vw] h-[50vw] lg:w-[25vw] lg:h-[25vw] rounded-full bg-gray-100">
          <img src={ProfileImg} alt="profileImg" className="rounded-full" />
        </div>
        <div>
          <p className=" text-2xl font-semibold text-black">
            {userProfile.name}
          </p>
          <p className=" text-xl opacity-60 text-black">{userProfile.login}</p>
        </div>
        <div className=" shadow-2xl border-gray-200 border-2 w-full lg:w-[40vw] justify-center flex gap-5 py-5  rounded-xl px-5 justify-self-end items-baseline">
          <a
            href="https://github.com/jennykut12"
            target="blank"
            className="flex items-center gap-5"
          >
            <FaShareSquare className=" text-2xl" />
            <p className=" font-semibold">See on GitHub</p>
          </a>
        </div>
        <div className="">
          <div className="flex gap-2 items-center">
            <p className=" font-semibold">{userProfile.public_repos}</p>
            <p>Repos</p>
          </div>
          <div className="flex  gap-2 items-center">
            <p className=" font-semibold">{userProfile.followers}</p>
            <p>Followers</p>
          </div>
          <div className="flex  gap-2 items-center">
            <p className=" font-semibold">{userProfile.following}</p>
            <p>Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
