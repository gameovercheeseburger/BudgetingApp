'use client';

import Link from 'next/link';
import {TrashIcon, HomeIcon} from '@heroicons/react/20/solid';
import { logoutAction } from '../actions/authActions';

const Nav = ({userName}) => {
  const handleLogout = async () => {
    if (confirm("Delete all user data?")) {
      await logoutAction();
    }
  };

  return (
    <nav>
      <Link href="/" aria-label="Go to Home" className="flex items-center gap-2">
        <HomeIcon width={25} />
        <span className="text-4xl">Budgie</span>
      </Link>
      {userName && (
        <button 
          onClick={handleLogout}
          className="btn btn--warning"
        >
          <span>Delete User</span>
          <TrashIcon width={25} />
        </button>
      )}
    </nav>
  );
};

export default Nav;