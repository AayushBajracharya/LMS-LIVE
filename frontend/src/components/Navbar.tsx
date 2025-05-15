import { Link, useNavigate } from 'react-router-dom';
import Nav from '../assets/NAV.svg';
import Logout from '../assets/W_logout.svg';
import { logout } from '../store/slices/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 w-[222px] h-screen bg-[#255D81] text-white flex flex-col items-center pt-[51px] shadow-[2px_0_5px_rgba(0,0,0,0.2)] z-[1030]">
      <div>
        <img src={Nav} alt="Logo" className="w-[152px] h-[62px]" />
      </div>

      <div className="flex flex-col items-start w-full mt-5">
        {[
          { path: '/dashboard', icon: 'Settings.png', label: 'Dashboard' },
          { path: '/author', icon: 'Author.png', label: 'Author' },
          { path: '/book', icon: 'Book.png', label: 'Books' },
          { path: '/student', icon: 'Student.png', label: 'Students' },
          { path: '/transaction-view', icon: 'transaction.png', label: 'Transactions' },
          { path: '/issue', icon: 'Issuing.png', label: 'Issuing' },
        ].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center w-full p-3 text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <img
              src={`/images/NavbarLogo/${link.icon}`}
              alt={`${link.label} Icon`}
              className="w-5 h-5 mr-2 hover:filter-invert"
            />
            {link.label}
          </Link>
        ))}
      </div>

      <div className="group mt-auto w-full">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          <img
            src={Logout}
            alt="Logout Icon"
            className="w-5 h-5 mr-2 transition-all duration-300 group-hover:custom-filter"
          />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;