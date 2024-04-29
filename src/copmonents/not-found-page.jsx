import React from "react";
import { ImNotification } from "react-icons/im";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col mt-28 gap-3 justify-center items-center">
      <h1 className=" text-4xl font-semibold">OOPS!!!</h1>
      <div>
        <ImNotification className=" text-9xl text-gray-200" />
      </div>
      <h1 className="text-xl font-semibold">Repository Not Found</h1>
      <p className="text-xl font-semibold text-center">
        The repository you are looking for does not exist or is not accessible.
      </p>
    </div>
  );
};

export default NotFoundPage;
