
import React from 'react';
import { MatchaCupIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-matcha-green text-white shadow-lg p-4 flex items-center justify-center">
      <MatchaCupIcon className="w-8 h-8 mr-3" />
      <h1 className="text-2xl font-bold tracking-wider">Matcha Latte Spotter</h1>
    </header>
  );
};

export default Header;
