import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';

const Nav = () => {
  return (
    <>
    <div className='bg-[#C70039] flex items-center justify-between p-10 lg:flex-row'>
      <div>
        <a href="#" className="text-black font-poppins text-3xl
        tracking-wider flex items-center">Jelajah Budaya</a>
      </div>
      <div className='space-x-4'>
        <div className='ssm:hidden lg:block space-x-2'>
        <a href="#" className='text-black hover:bg-[#9f002e]
        rounded-full px-5 py-2 text-xl'>Explore</a>
        <a href="#" className='text-black hover:bg-[#9f002e]
        rounded-full px-5 py-2 text-xl'>Event</a>
        <a href="#" className='text-black hover:bg-[#9f002e]
        rounded-full px-5 py-2 text-xl'>Login</a>
        </div>
        <div className='ssm:block lg:hidden'>
          <AiOutlineClose size={30} className='text-white'/>
        </div>
      </div>
    </div>
    </>
  );
};

export default Nav;
