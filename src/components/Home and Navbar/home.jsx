import React, { useEffect } from "react";
import { useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
// import { ParallaxHover } from "react-parallax-hover";
import { Box, Button, Modal, Skeleton, Typography } from "@mui/material";
import bd from "../../images/dark-logo.png"
import my from "../../images/MythX_logo_Horizontal.svg"
import infura from "../../images/infura-logo.png"
import Footer from "../Footer";
import Cookies from "universal-cookie";
import * as PushAPI from "@pushprotocol/restapi";
import { useAccount, useSigner } from "wagmi";

const Home = () => {
  const cookies = new Cookies();
  const [newButton, setNewButton] = useState({ hidden: false });
  const { data: signer } = useSigner();
  const [open, setOpen] = useState(false);
  const [showOpted, setOpted] = useState(false);
  const { address, isConnected } = useAccount();
  const [showPushNotifications, setPushNotifications] = useState([]);
  const [showNewNotification, setNewNotification] = useState(false);
  const [notificationNumber, setnotificationNumber] = useState(0);
  const [showDisplayNotification, setDisplayNotification] = useState(false);
  const navigate = new useNavigate();

  const takeToPlayer = () => {
    setNewButton({ hidden: true });
    setTimeout(navigate("/signup"), 3000);
  };

  const handleOpen = () => {
    setDisplayNotification(true);
    setnotificationNumber(0);
    cookies.set("notificationCount", 0);
    setNewNotification(false);
    setOpen(true);
    // notifi();
  };
  const handleClose = () => {
    setOpen(false);
    setnotificationNumber(0);
    cookies.set("notificationCount", 0);
    setNewNotification(false);
    setDisplayNotification(false);
  };

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: "eip155:5:0x070F992829575477A0E91D9D3e49dCFcd06d3C22", // channel address in CAIP
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
      channelAddress: "eip155:5:0x070F992829575477A0E91D9D3e49dCFcd06d3C22", // channel address in CAIP
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
            "0x070F992829575477A0E91D9D3e49dCFcd06d3C22"
          ) {
            console.log("subscribed");
            setOpted(true);
          }
        }
        console.log(subscriptions);
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
  return (
    <>
      {/* <Navbar /> */}
      <div
        className="home"
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <section className="home-top">
          <div className="home-main">
            <div className="home-content-main">
              <h1 className="main-heading">
              Invest your tokens and let the interest from the money you've invested cover the cost of your subscriptions.
              </h1>
              <h3 className="description-heading">
              StakeYard aspires to develop into a groundbreaking DeFi platform where users can stake certain tokens in a pool and earn interest on those tokens as well as a subscription of their choosing.
              </h3>
                <div className="home-button">
                  <button className="signup" onClick={() => {
                      takeToPlayer();
                    }}>Sign up</button>
              </div>
            </div>
          </div>
        </section>
          <div className="second-section">
            <h2>Let your Interest of your staked money pay for your subscription.</h2>
            <h2>Get your staked money back in a year.</h2>
            <div className="companies-imgs">
            <div className="img-parent">
              <img src={bd} alt="blockdemon-logo" />
            </div>
            <div className="img-parent">
              <img src={my} alt="mythx-logo" />
            </div>
            <div className="img-parent">
              <img src={infura} alt="infura-inc-logo" />
            </div>
          </div>
          </div>
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
              showOpted === true &&
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
                <h4>Opt In Superfluid IDA channel to get notifications </h4>
                <p>
                  Channel address - 0x070F992829575477A0E91D9D3e49dCFcd06d3C22{" "}
                </p>
              </div>
            ) : null}
          </div>
        </Box>
      </Modal>
       <Footer/>
        
      </div>
    </>
  );
};

export default Home;
