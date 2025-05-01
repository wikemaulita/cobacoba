import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <>
    <div className='bg-[#C70039] flex items-center justify-between p-10 lg:flex-row'>
      <div>
        <a href="#" className="text-black font-roboto text-3x1
        tracking-wider flex items-center">Jelajah Budaya</a>
      </div>
      <div className='space-x-4'>
        <a href="#" className='text-black hover:bg-indigo:800
        rounded-full px-5 py-2 text-xl'>Explore</a>
        <a href="#" className='text-black hover:bg-indigo:800
        rounded-full px-5 py-2 text-xl'>Event</a>
        <a href="#" className='text-black hover:bg-indigo:800
        rounded-full px-5 py-2 text-xl'>Login</a>
      </div>
    </div>
    </>
  );
};

export default Nav;
