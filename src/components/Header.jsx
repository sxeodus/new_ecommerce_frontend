import React, { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useProductStore } from '../stores/productStore';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import SearchBox from './SearchBox';

function Header() {
  // Select state and actions individually. This is a best practice with Zustand
  // to prevent re-renders when unrelated parts of the state change.
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const items = useCartStore((state) => state.items);
  const categories = useProductStore((state) => state.categories);
  const fetchCategories = useProductStore((state) => state.fetchCategories);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect was causing an infinite loop because `fetchCategories` was a new
    // function on every render. By changing the dependency array to be empty,
    // we ensure it only runs once when the component mounts.
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const activeLinkClass = 'bg-blue-600 text-white';
  const inactiveLinkClass = 'text-gray-700 hover:bg-gray-200 hover:text-gray-900';
  const linkClasses = 'rounded-md px-3 py-2 text-sm font-medium';

  return (
    <header className="sticky top-0 z-50 bg-gray-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              E-Store
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/products"
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}
                >
                  Products
                </NavLink>
                {/* Categories Dropdown */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className={`${linkClasses} ${inactiveLinkClass} inline-flex w-full justify-center items-center gap-x-1.5`}>
                      Categories
                      <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {categories.map((category) => (
                          <Menu.Item key={category}>
                            {({ active }) => (
                              <Link
                                to={`/products?category=${encodeURIComponent(category)}`}
                                className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-4 py-2 text-sm`}
                              >
                                {category}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4">
              <SearchBox />
            </div>
            <Link to="/cart" className="relative rounded-full p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-1 text-xs font-bold leading-none text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <div className="ml-4">
              {user ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                    {user?.username}
                    <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" />
                  </Menu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {user?.isAdmin && (
                        <Menu.Item>
                          {({ active }) => (
                            <Link to="/admin/dashboard" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                              Admin Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                      )}
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/profile" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link to="/my-orders" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                            My Orders
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={handleLogout} className={`${active ? 'bg-gray-100' : ''} block w-full px-4 py-2 text-left text-sm text-gray-700`}>
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Link to="/login" className={`${linkClasses} ${inactiveLinkClass}`}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
