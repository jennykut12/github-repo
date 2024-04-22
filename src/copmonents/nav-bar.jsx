import React from 'react'

const Navbar = () => {
  return (
    <div className="navbar">
  <div className="">
    <a className="btn btn-ghost text-xl">daisyUI</a>
  </div>
  <div className="flex-none gap-2">
    <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div>
  </div>
</div>
  )
}

export default Navbar