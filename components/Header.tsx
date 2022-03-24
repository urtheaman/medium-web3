import { NextPage } from "next";
import Link from "next/link";

const style = {
  headerContainer: ``,
};

const Header: NextPage = () => {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <img
            src="https://links.papareact.com/yvf"
            alt="medium logo"
            className="w-44 object-contain cursor-pointer"
          />
        </Link>

        <div className="hidden md:inline-flex items-center  space-x-5">
          <h3>About</h3>
          <h3>Contact</h3>
          <button className="text-white bg-green-600 py-1 px-4 rounded-full">
            Follow
          </button>
        </div>
      </div>
      {/* right starts */}
      <div className="inline-flex text-green-600 items-center space-x-5">
        <button>Sign in</button>
        <button className="border border-green-600  py-1 px-4 rounded-full">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
