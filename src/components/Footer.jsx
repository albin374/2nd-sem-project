import React from "react";

const Footer = () => {
  return (
    <footer className="mt-10 bg-blue-700 text-white text-center p-4">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} EV Charger Locator. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
