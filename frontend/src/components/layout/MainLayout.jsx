/**
 * Layout principal de l'application
 * Contient le Header, Sidebar et Footer
 */

import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      {/* Header */}
      {/* <Header /> */}

      <div className="d-flex">
        {/* Sidebar */}
        {/* <Sidebar /> */}

        {/* Contenu principal */}
        <main className="content-wrapper flex-grow-1">
          {children}
        </main>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
