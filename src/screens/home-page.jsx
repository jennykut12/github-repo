import React, { useEffect, useState } from "react";
import Profile from "../copmonents/profile";
import Repo from "../copmonents/repo";

const HomePage = () => {
  return (
    <div>
      <main className="lg:grid lg:grid-cols-2 gap-4 min-h-[60vh] justify-center items-center my-20 ">
        <div className=" col-span-1 mb-10">
          <Profile />
        </div>
        <Repo />
      </main>
    </div>
  );
};

export default HomePage;
