'use client';

import Link from 'next/link';

const links = [
  { name: 'Analysis', href: '/analyser' },
  { name: 'Profile', href: '/profile' },
  { name: 'Settings', href: '/profile/edit' },
  { name: 'Journal', href: '/journal' },
];

export default function NavLinks({
  isMobile,
  closeMenu,
}: {
  isMobile: boolean;
  closeMenu: () => void;
}) {
  return (
    <>
      {links.map((link) => {
        return (
          <Link key={link.name} href={link.href}>
            <span
              onClick={closeMenu}
              className={`text-white hover:text-purple-300 cursor-pointer  ${
                isMobile ? 'block py-2' : 'inline-block'
              }`}
            >
              {link.name}
            </span>
          </Link>
        );
      })}
    </>
  );
}
