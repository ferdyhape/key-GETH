let exampleKeystore = {
  address: "5b5cd226194d0ede2652102d52fc0a9ed0f38c0d",
  crypto: {
    cipher: "aes-128-ctr",
    ciphertext:
      "4c2090a0cc9518ed751a66980b260732e25c329aad80774576e4719551086998",
    cipherparams: { iv: "e76c2430f28921ce02e87ee4d5814007" },
    kdf: "scrypt",
    kdfparams: {
      dklen: 32,
      n: 262144,
      p: 1,
      r: 8,
      salt: "108d85b44d73346e7d2c472c8a3fb52908a198853a1cf4302f382eb1e5693c39",
    },
    mac: "de985c35ebd22a2e3577bd3c439b855cc8d6490e3e3e4a84615fd95f5603890b",
  },
  id: "ead788d2-0bc5-4386-a250-13cbd8a727e1",
  version: 3,
};

// Fill the textarea with an example KeyStore JSON with text("example:") on one line and then move to a new line
document.getElementById("keystore").placeholder =
  "Example:\n" + JSON.stringify(exampleKeystore, null, 4);

document
  .getElementById("privateKeyForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    const password = document.getElementById("password").value;
    const keystore = document.getElementById("keystore").value;
    let keyStoreObj;
    try {
      keyStoreObj = JSON.parse(keystore);
    } catch (error) {
      console.error("Error parsing KeyStore JSON:", error.message);
      displayErrorAlert(error.message);
      return;
    }

    try {
      const privateKey = generatePrivateKey(password, keyStoreObj);
      displaySuccessAlert(privateKey);
    } catch (error) {
      console.error("Error generating private key:", error.message);
      displayErrorAlert(error.message);
    }
  });

function generatePrivateKey(password, keyStore) {
  privkey = keythereum.recover(password, keyStore);
  return privkey.toString("hex");
}

function displaySuccessAlert(privateKey) {
  const alertMessage = document.getElementById("alertMessage");
  const censoredPrivateKey =
    privateKey.slice(0, 10) + "..." + privateKey.slice(-10);
  alertMessage.innerHTML = `
        <div class="alert alert-success d-flex justify-content-between" role="alert">
            <div id="private-key-to-copy" class="my-auto">Your private key: ${censoredPrivateKey}</div>
            <div id="copyFeedback" class="my-auto">Copied!</div>
            <button id="copyButton" class="btn" data-clipboard-text="${privateKey}">
                <img src="/assets/icon/copy.svg" alt="Copy to clipboard" style="width: 20px;">
            </button>
        </div>`;

  const copyButton = document.getElementById("copyButton");
  const copyFeedback = document.getElementById("copyFeedback");

  // Manually initialize ClipboardJS for the newly added copy button
  const clipboard = new ClipboardJS(copyButton);

  // Update tooltip text when copying is successful
  clipboard.on("success", function (e) {
    e.clearSelection();
    copyButton.style.display = "none"; // Hide the copy button
    copyFeedback.style.display = "inline-block"; // Display the copy feedback message

    // Hide the copy feedback message after 2 seconds
    setTimeout(function () {
      copyFeedback.style.display = "none"; // Hide the copy feedback message
      copyButton.style.display = "inline-block"; // Show the copy button again
    }, 2000); // Change the duration as needed (in milliseconds)
  });
}

function displayErrorAlert(errorMessage) {
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${errorMessage}
        </div>`;
}
