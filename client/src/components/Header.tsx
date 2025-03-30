import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white h-[60px] shadow-sm w-full">
      <div className="h-full flex items-center">
        <div className="flex items-center">
          <a href="/" className="mr-6">
            <img src="/images/forum.png" width="110" alt="Forum" title="Forum" />
          </a>
          <a href="/" className="mx-6">
            <img src="/images/salvum-logo.png" width="110" alt="Salvum" title="Salvum" />
          </a>
          <h1 className="text-3xl text-[#00AEEF] font-light tracking-wide m-0 ml-6">
            Pago Express
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;