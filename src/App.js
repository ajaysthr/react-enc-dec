import './App.css';
// 👇️ import useState hook
import {useState} from 'react';
import CryptoJS from 'crypto-js'

function aesEncrypt(data) {
  let key = '6fa979f20126cb08aa645a8f495f6d85';
  let iv = '7777777a72ddc2f1';
  let cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: CryptoJS.enc.Utf8.parse(iv),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
  });
  console.log('aes--',cipher.toString());
  return cipher.toString();
}

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [message, setMessage] = useState("");

  let handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form data',name + email + mobileNumber);
    let encNamme = aesEncrypt(name);
    console.log('name after set state', encNamme);
    let encEmail = aesEncrypt(email);
    console.log('email after set state', encEmail);
    let encMno = aesEncrypt(mobileNumber);
    console.log('m no after set state', encMno);
    try {
      let res = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          name: encNamme,
          email: encEmail,
          mobileNumber: encMno,
        }),
      });
      let resJson = await res.json();
      console.log('api response ---',resJson);
      if (res.status === 200) {
        setName("");
        setEmail("");
        setMessage("User created successfully");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          value={mobileNumber}
          placeholder="Mobile Number"
          onChange={(e) => setMobileNumber(e.target.value)}
        />

        <button type="submit">Create</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}

export default App;
