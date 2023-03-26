import React, { useRef, useState } from "react";
import "./signup.scss";
import { ethers } from "ethers";
import BG from "../../images/bg.svg";

import ss_abi from "../../artifacts/contracts/stakescription.sol/stakescription.json";
import axios from "axios";

const SignUp = () => {
  const SCROLL_CONTRACT_ADDRESS = "0xC7eC9E3143620FCB5A719818372D72b7F75d3CA5";
  const CONTRACT_ADDRESS = "0x0e313A08547361F265d634B5A7b9179f432d0f52";

  const [userAddress, setUserAddress] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [userImage, setUserImage] = useState("");

  // let imageUri = "";

  const addUser = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const addr = await signer.getAddress();
      setUserAddress(addr.toString());

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ss_abi.abi,
        signer
      );
      console.log("wait...");
      let tx = await connectedContract.addUser(name, email, number, userImage);
      console.log("=V=====V=======V=========V=======V=====V=");
      console.log(tx);
      console.log("value set!");
      console.log("====================================");
    }
  };

  const uploadImage = async (e) => {
    const profile_image = e.target.files[0];
    console.log(profile_image);

    const form = new FormData();
    form.append("file", profile_image);

    const options = {
      method: "POST",
      url: "https://api.nftport.xyz/v0/files",
      headers: {
        "Content-Type":
          "multipart/form-data; boundary=---011000010111000001101001",
        Authorization: "d371605c-bf67-4bb5-ae3e-dace4ac6810e",
      },
      data: form,
    };
    console.log(options);

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data.ipfs_url);
        setUserImage(response.data.ipfs_url);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fileInputRef = useRef();
  return (
    <div className="sign-main">
      <div className="sign-sub">
        <div className="sign-header">Sign Up</div>

        <div className="sign-form-item">
          <input
            className="sign-text-field"
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>

        <div className="sign-form-item">
          <input
            className="sign-text-field"
            type="email"
            placeholder="E-Mail"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>

        <div className="sign-form-item">
          <input
            className="sign-text-field"
            type="tel"
            placeholder="Mobile Number"
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          ></input>
        </div>
        <div className="sign-form-item">
          <button
            className="file-btn"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            Upload Profile Image
          </button>
          <input
            className="sign-text-field"
            type="file"
            placeholder="Upload Profile Image"
            hidden
            ref={fileInputRef}
            onChange={(e) => {
              uploadImage(e);
            }}
          ></input>
          {userImage ? (
            <div className="picked-image">
              <img
                alt="uploading"
                className="uploaded-image"
                src={userImage}
              ></img>
            </div>
          ) : (
            ""
          )}
        </div>

        <button className="sign-btn" onClick={addUser}>
          Register
        </button>
      </div>
    </div>
  );
};

export default SignUp;
