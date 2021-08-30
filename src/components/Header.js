import Image from "next/image";
import {
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
} from "@heroicons/react/outline";
import Currency from "react-currency-formatter";
import SideCart from "./SideCart";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { selectTotalItems } from "../slices/basketSlice";
import { useSelector } from "react-redux";
import Notification from "../components/Notification";
import Firebase from 'firebase'
import firebase from "../../firebase";
import database from "../../firebase";

function Header({ setShowCart, showCart, products }) {
  const [session] = useSession();
  const router = useRouter();
  const selectTotalItem = useSelector(selectTotalItems);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSearchResults(
      products?.filter((product) => product.name.includes(searchTerm))
    );
  };
  let totalfund =0;
  var totalpending =0;
  const getFunds = () => {
  
    var ref = Firebase.database().ref(`fund/${session?.user.name}`);
    ref.on('value', getFund, errord);
    function getFund(data) {
      if (data.val() != null && data.val()!== undefined){
      var score = data.val();
      var key = Object.keys(score);
      let i = key.length;
      for (let index = 0; index < key.length; index++) {
        var k = key[index];
        var report = score[k].repoted;
        var funds = score[k].funds
        if (report == "pending") { console.log(report)
          totalpending +=funds;
          console.log(funds)
         
          console.log("totalpending",totalpending)
     }
        else{ funds = parseInt(funds)
      totalfund +=parseInt(funds) ;
         totalfund=totalfund}
        }}
    }


    function errord(err) {
      console.log("error here");
      console.log(err);
    }

  };

  getFunds();
  return (
    <>
      <div
        className="header"
        style={{ position: "sticky", top: 0, zIndex: 50 }}
      >
        <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
          <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
            <Image
              src="https://i.imgur.com/WZcYvhG.png"
              width={150}
              height={40}
              objectFit="contain"
              className="cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          {/* Hello */}
          {/* Search */}
          <div className="hidden relative items-center flex-grow cursor-pointer rounded-md h-10 bg-yellow-400 sm:flex hover:bg-yellow-500">
            <input
              onMouseOver={() => setShowResults(true)}
              onBlur={() => setShowResults(false)}
              onFocus={() => setShowResults(true)}
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search anything you need... (Live Search)"
              className="p-2 px-5 h-full width-6 flex-grow rounded flex-shrink rounded-l-md focus:outline-none"
              type="text"
            />
            <SearchIcon className="h-12 p-4" />

            {showResults && (
              <div
                onClick={() => setShowResults(true)}
                onMouseOver={() => setShowResults(true)}
                onMouseLeave={() => setShowResults(false)}
                className="absolute w-full bg-white bottom-0 z-10 rounded-md"
                style={{
                  transform: "translateY(100%)",
                  height: "auto",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {!!searchResults?.length ? (
                  searchResults.map(({ id, name, price, category }) => (
                    <div
                      key={Math.random()}
                      className="p-2 mt-2 border-b-2 rounded-md border-gray-100 bg-gray-50"
                    >
                      <Link href={`/product/${id}`}>
                        <h5 className="font-medium text-sm text-gray-600">
                          {name}
                        </h5>
                      </Link>
                      <Link href={`/product/${id}`}>
                        <p className="text-xs text-gray-400">
                          {category}
                          <Currency quantity={price} />
                        </p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <>
                    {searchTerm && (
                      <p className="text-xs text-gray-400 text-center py-2">
                        No product found
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
            <div
              onClick={!session ? () => router.push("/Login") : signOut}
              className="link"
            >
              <p>{session ? `Hello, ${session.user.name}` : "Sign In"}</p>
              <p className="font-extrabold md:text-sm">{totalfund}  your walet</p>
            </div>
            <div className="link" onClick={() => router.push("/orders")}>
              <p>Retuen</p>
              <p className="font-extrabold md:text-sm">& Orders</p>
            </div>
            <div
              className="link "
            /*onClick={!session ? () => router.push("./Login") : addfunds}*/
            >
              <Notification />
              {/*<p className="font-extrabold md:text-sm">Funds</p>**/}
            </div>
            <div
              title="Please Click MEEEE"
              onClick={() => router.push("/checkout")}
              className="link relative flex items-center"
            >
              <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded text-black font-bold">
                {selectTotalItem}
              </span>
              <ShoppingCartIcon className="h-10 " />
              <p className="font-extrabold md:text-sm hidden md:inline mt-2 ">
                Your Cart
              </p>
            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div
          // onClick={() => router.push("/product")}
          className="flex space-x-3 p-2 pl-6 items-center bg-amazon_blue-light text-white text-sm"
        >
          <p
            className="link flex items-center"
            onClick={() => router.push("/product")}
          >
            <MenuIcon className="h-6 mr-1" />
            All
          </p>

          <p
            className="link hidden lg:inline-flex"
            onClick={() => router.push("/Addproduct")}
          >
            sell product
          </p>
        
           <p className="link hidden lg:inline-flex"
            onClick={() => router.push("./used")}
          >Used Products</p>
        </div>
      </div>
      {showCart && <SideCart setShowCart={setShowCart} />}
    </>
  );
}

export default Header;
