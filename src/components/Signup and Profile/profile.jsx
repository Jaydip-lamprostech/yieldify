import React, { useState, useEffect, useRef } from "react";
import "./profile.scss";
import EditProfile from "./editprofile";
import BG from "../../images/bg.svg";
import ProfilePic from "../../images/man.png";
import AAVE from "../../images/aave.svg";
import Link from "../../images/link.svg";
import Uni from "../../images/uni.svg";
import { HiOutlineMail } from "react-icons/hi";
import { FiUser } from "react-icons/fi";
import { BiMobileAlt } from "react-icons/bi";
import { ethers } from "ethers";
import ss_abi from "../../artifacts/contracts/stakescription.sol/stakescription.json";
import { useAccount } from "wagmi";

const Profile = ({ mainContract, account }) => {
  let arr = [1, 2, 3];
  const [_activePlans, setActivePlans] = useState("");

  const { address, isConnecting, isDisconnected } = useAccount();

  const SCROLL_CONTRACT_ADDRESS = "0xC7eC9E3143620FCB5A719818372D72b7F75d3CA5";
  const CONTRACT_ADDRESS = "0x0e313A08547361F265d634B5A7b9179f432d0f52";
  const [userAddress, setUserAddress] = useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [buttonPopup, setButtonPopup] = useState(false);

  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  const [userNumber, setUserNumber] = React.useState("");
  const [userImage, setUserImage] = React.useState("");
  const [data, setData] = React.useState("");

  let planName = [];
  const activePlans = [];

  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    await getPlanDetails();
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ss_abi.abi,
        signer
      );
      console.log("wait...");
      let tx = await connectedContract.getUserDetails(address);

      console.log("=V======V========V======V=======V=======V=");
      // console.log(tx);
      console.log(tx[0]);
      setUserName(tx[0]);

      console.log(tx[1]);
      setUserEmail(tx[1]);

      console.log(parseInt(tx[2]));
      setUserNumber(parseInt(tx[2]));

      console.log(tx[3]);
      setUserImage(tx[3]);

      console.log("Data Fetched!");
      console.log("====================================");
    }
  };

  const showUserPlans = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ss_abi.abi,
        signer
      );
      console.log("wait...");
      let tx = await connectedContract.showUserPlans(address);
      console.log(tx);
      const userPlans = [];
      console.log("=V======V========V======V=======V=======V=");
      for (let i = 0; i < tx.length; i++) {
        userPlans.push(parseInt(tx[i]));
      }
      console.log(userPlans);
      console.log("here are all plans user've subscribed to!");
      console.log("====================================");
      return userPlans;
    }
  };
  const showUserActivePlans = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ss_abi.abi,
        signer
      );
      console.log("wait calling another fn...");
      const userPlans = await showUserPlans();
      console.log(userPlans);
      console.log(userPlans.length);

      console.log("wait...");
      let tx;
      // const activePlans = [];
      for (let i = 0; i < userPlans.length; i++) {
        tx = await connectedContract.showUserActivePlans(address, userPlans[i]);
        console.log(tx);
        if (tx == true) {
          activePlans.push(userPlans[i]);
        }
      }
      console.log("=V======V========V======V=======V=======V=");
      console.log(activePlans);
      setActivePlans(activePlans);
      console.log("Your active Plans!");
      console.log("====================================");
      return activePlans;
    }
  };
  const getPlansCount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ss_abi.abi,
      provider
    );
    let tx = await connectedContract.countPlan();
    console.log(tx);
    return tx;
  };

  const getPlanDetails = async () => {
    // let abc = await showUserActivePlans();
    // let count = await getPlansCount();
    let count = [];
    count = await showUserActivePlans();
    console.log("Active Plans: " + count);
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ss_abi.abi,
        signer
      );
      console.log("wait...");
      for (let i = 0; i < activePlans.length; i++) {
        console.log(i);
        let tx = await connectedContract.getPlanDetails(activePlans[i]);
        console.log("=V======V========V======V=======V=======V=");
        console.log(tx[0]);
        planName.push({
          name: tx[0],
          price: parseInt(tx[1]),
          duration: parseInt(tx[2]),
          image: tx[3],
        });

        console.log(parseInt(tx[1]));
        // setPlanPrice(parseInt(tx[1]));

        console.log(parseInt(tx[2]));
        // setPlanTimePeriod(parseInt(tx[2]));

        console.log(tx[3]);
        // setPlanImage(tx[3]);
        console.log("====================================");
      }
      console.log(planName);
      setData(planName);
      console.log("====================================");
      console.log("IN Data");
      console.log("====================================");
      setLoading(false);
    }
  };

  return (
    <div className="profile-main">
      {buttonPopup && (
        <EditProfile
          closeModal={setButtonPopup}
          mainContract={mainContract}
          account={account}
          name={name}
          email={email}
          designation={designation}
        />
      )}
      <div className="profile-sub">
        {/* <div className="profile-top"></div> */}
        <div className="profile-position">
          <div className="profile-left">
            <div className="profile-header">Profile</div>
            <img className="profile-img" src={userImage} alt="profile-img" />
            <div className="profile-content-main">
              <div className="profile-content">
                Name - <span>{userName}</span>
              </div>
            </div>
            <div className="profile-content-main">
              <div className="profile-content">
                Email - <span>{userEmail}</span>
              </div>
            </div>
            <div className="profile-content-main">
              <div className="profile-content">
                Contact Number - <span>{userNumber}</span>
              </div>
            </div>
          </div>
          <div className="profile-right">
            <div className="profile-sub-header">Active Subscription</div>
            {isLoading
              ? null
              : data.map((item, key) => {
                  console.log("====================================");
                  console.log(item);
                  console.log("====================================");
                  return (
                    <div className="profile-right-main" key={key}>
                      <div className="profile-right-sub">
                        {/* <img className="profile-right-icon" src={AAVE} />
                  <div className="profile-right-txt">AAVE</div> */}

                        <img
                          className="profile-right-icon"
                          src={item.image}
                          alt=""
                        />
                        <div className="profile-right-txt">{item.name}</div>
                      </div>
                    </div>
                  );
                })}
            {/* <div className="profile-right-main">
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={AAVE} />
                <div className="profile-right-txt">AAVE</div>
              </div>
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={Link} />
                <div className="profile-right-txt">LINK</div>
              </div>
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={Uni} />
                <div className="profile-right-txt">UNI</div>
              </div>
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={AAVE} />
                <div className="profile-right-txt">AAVE</div>
              </div>
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={Link} />
                <div className="profile-right-txt">LINK</div>
              </div>
              <div className="profile-right-sub">
                <img className="profile-right-icon" src={Uni} />
                <div className="profile-right-txt">UNI</div>
              </div>
            </div>/ */}
          </div>
        </div>
        <button
          onClick={() => {
            setButtonPopup(true);
          }}
          className="profile-btn"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
