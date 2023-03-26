import React, { useState, useEffect } from "react";
// import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import MenuIcon from "./MenuIcon";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import logo from "../../images/yieldify.png";
import { Button } from "@mui/material";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useProvider,
  useSigner,
} from "wagmi";
import { Box, Modal, Skeleton, Typography } from "@mui/material";
import * as PushAPI from "@pushprotocol/restapi";
import Cookies from "universal-cookie";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// import { useProvider } from 'wagmi'

const Navbar = () => {
  const cookies = new Cookies();

  // const [error, setError] = useState();
  const provider = useProvider();
  const _chainId = provider.getNetwork();
  let navigate = useNavigate();
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  // const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(true);
  const [connected, setConnection] = useState(false);
  const { data: signer } = useSigner();
  const [open, setOpen] = useState(false);
  const [showOpted, setOpted] = useState(false);
  const { address } = useAccount();
  const [showPushNotifications, setPushNotifications] = useState([]);
  const [showNewNotification, setNewNotification] = useState(false);
  const [notificationNumber, setnotificationNumber] = useState(0);
  const [showDisplayNotification, setDisplayNotification] = useState(false);
  const [error, setError] = useState();

  const handleOpen = () => {
    setDisplayNotification(true);
    // setnotificationNumber(0);
    // cookies.set("notificationCount", 0);
    // setNewNotification(false);
    setOpen(true);
    // notifi();
  };
  const handleClose = () => {
    setOpen(false);
    // setnotificationNumber(0);
    // cookies.set("notificationCount", 0);
    // setNewNotification(false);
    setDisplayNotification(false);
  };

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: "eip155:5:0xeB88DDaEdA2261298F1b740137B2ae35aA42A975", // channel address in CAIP
      userAddress: `eip155:5:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  };

  const optOut = async () => {
    await PushAPI.channels.unsubscribe({
      signer: signer,
      channelAddress: "eip155:5:0xeB88DDaEdA2261298F1b740137B2ae35aA42A975", // channel address in CAIP
      userAddress: `eip155:5:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt out success");
      },
      onError: () => {
        console.error("opt out error");
      },
      env: "staging",
    });
  };
  useEffect(() => {
    console.log(cookies.get("notificationCount"));
    if (address) {
      const timeInterval = setInterval(async () => {
        console.log("timer");
        const subscriptions = await PushAPI.user.getSubscriptions({
          user: `eip155:5:${address}`, // user address in CAIP
          env: "staging",
        });
        if (subscriptions.length === 0) {
          setOpted(false);
        }
        for (let i = 0; i < subscriptions.length; i++) {
          if (
            subscriptions[i].channel ===
            "0xeB88DDaEdA2261298F1b740137B2ae35aA42A975"
          ) {
            console.log("subscribed");
            setOpted(true);
          }
        }
        // console.log(subscriptions);
        const notifications = await PushAPI.user.getFeeds({
          user: `eip155:5:${address}`, // user address in CAIP
          env: "staging",
          limit: 100,
        });
        console.log(notifications);
        // for (let i = 0; i < notifications.length; i++) {
        //   if(notifications[i].app !== "")
        // }
        // if (
        //   cookies.get("notificationCount") !==
        //   notifications.length - showPushNotifications.length
        // ) {
        //   cookies.set(
        //     "notificationCount",
        //     notifications.length - showPushNotifications.length
        //   );
        // }

        if (notifications.length > showPushNotifications.length) {
          setNewNotification(true);
          console.log("first");
          cookies.set(
            "notificationCount",
            notifications.length - showPushNotifications.length
          );
          showPushNotifications.splice(0, showPushNotifications.length);
          for (let i = 0; i < notifications.length; i++) {
            // if (notifications[i].app === "Money-Router")
            showPushNotifications.push(notifications[i]);
          }
          // if (showPushNotifications.length === notifications.length) {
          //   setDisplayNotification(true);
          // }
          // setPushNotifications(showPushNotifications);
          setnotificationNumber(cookies.get("notificationCount"));
        }

        // console.log(showPushNotifications);
        // setPushNotifications(showPushNotifications);
      }, 5000);
      return () => clearInterval(timeInterval);
    }
  }, [address]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 0,
    paddingBottom: "32px",
    maxHeight: "70vh",
    overflow: "auto",
    overflowX: "hidden",
    maxWidth: "700px",
  };
  const networks = {
    bittorrent: {
      chainId: `0x${Number(1029).toString(16)}`,
      chainName: "BitTorrent Chain Donau",
      nativeCurrency: {
        name: "BTT",
        symbol: "BTT",
        decimals: 18,
      },
      rpcUrls: ["https://pre-rpc.bt.io/"],
      blockExplorerUrls: ["https://testscan.bt.io"],
    },
  };

  const changeNetwork = async ({ networkName, setError }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            ...networks[networkName],
          },
        ],
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNetworkSwitch = async (networkName) => {
    setError();
    await changeNetwork({ networkName, setError });
  };

  const connectWallet = () => {
    connect();
  };

  useEffect(() => {
    if (isConnected) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      setConnection(true);
    } else {
      setConnection(false);
    }
  }, []);

  return (
    <nav className="navbar">
      {/* <Link to="/" className="nav-logo">
        <img src={logo} />
      </Link> */}
      {/* <div onClick={handleClick} className="nav-icon">
        {open ? <FiX /> : <FiMenu />}
      </div> */}
      {/* <ul className={open ? "nav-links" : "nav-links active"}> */}
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            {/* <img className="nav-logo" src={logo} alt="logo"/> */}
            <h1 className="logo-h1">YIELDIFY</h1>
          </Link>
        </li>

        {connected ? (
          <>
            <li className="nav-item">
              <Link to="/signup" className="nav-link">
                <div className="navtextstyle">Sign Up</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/subscription" className="nav-link">
                <div className="navtextstyle">Explore</div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <div className="navtextstyle">Profile</div>
              </Link>
            </li>
            <li className="nav-item">
              {/* <button
                className="nav-disconnect"
                onClick={() => {
                  disconnect();
                }}
              >
                Disconnect
              </button> */}
              <ConnectButton
                chainStatus="name"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "full",
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </li>
          </>
        ) : (
          <li className="nav-item">
            {/* <button
              className="nav-button"
              onClick={() => {
                connectWallet();
                // handleNetworkSwitch("bittorrent");
              }}
            >
              Connect
            </button> */}
            <ConnectButton chainStatus="name" />
          </li>
        )}
      </ul>

      {isConnected ? (
        <Button onClick={handleOpen} className="notification-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#ffffff"
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z" />
          </svg>
          {showNewNotification ? (
            <span className="red-dot">
              {notificationNumber > 0 ? notificationNumber : null}
            </span>
          ) : null}
        </Button>
      ) : null}
      <div
        className="nav-ham-menu"
        onClick={() => {
          setMenu(!menu);
        }}
      >
        <MenuIcon />
      </div>
      {menu ? (
        <div className="mobile-menu">
          <ul>
            <li>
              <span
                onClick={() => {
                  navigate("/");
                }}
              >
                Home
              </span>
            </li>
            <li>
              <span
                onClick={() => {
                  navigate("/signup");
                }}
              >
                Sign In
              </span>
            </li>
            {connected ? (
              <>
                <li>
                  <span
                    onClick={() => {
                      navigate("/subscription");
                    }}
                  >
                    Explore
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </span>
                </li>
                <li>
                  <button
                    className="nav-button"
                    onClick={() => {
                      disconnect();
                    }}
                  >
                    Disconnect
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="nav-button"
                  onClick={() => {
                    connectWallet();
                  }}
                >
                  Connect
                </button>
              </li>
            )}
          </ul>
        </div>
      ) : null}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "#f3f4f6",
              padding: "20px 20px",
              margin: "0px",
              fontWeight: 600,
            }}
          >
            Notifications
            {showOpted === true ? (
              <button onClick={() => optOut()} className="push-btns">
                Opt Out
              </button>
            ) : showOpted === false ? (
              <button onClick={() => optIn()} className="push-btns">
                Opt IN
              </button>
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                sx={{ bgcolor: "grey.100" }}
              />
            )}
          </Typography>{" "}
          <div
            id="modal-modal-description"
            style={{ marginTop: "20px", padding: "10px" }}
          >
            {showDisplayNotification &&
              showPushNotifications.length > 0 &&
              showOpted &&
              showPushNotifications.map((item, key) => {
                return (
                  <div
                    style={{
                      border: "1px solid #10bb35aa",
                      margin: "10px 0px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                    key={key}
                  >
                    <h4>{item.title} </h4>
                    <p>{item.message}</p>
                  </div>
                );
              })}
            {!showOpted ? (
              <div
                style={{
                  border: "1px solid #10bb35aa",
                  margin: "10px 0px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <h4>Opt In YIELDIFY channel to get notifications </h4>
                <p>
                  Channel address - 0xeB88DDaEdA2261298F1b740137B2ae35aA42A975{" "}
                </p>
              </div>
            ) : null}
          </div>
        </Box>
      </Modal>
    </nav>
  );
};

export default Navbar;
