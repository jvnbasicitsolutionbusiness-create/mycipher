const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxRoGQLDRorElBh6HbTxNMQLNtOmTwiJqMmH45Fm_7jVu8k8jaEyXL0Bq8tiqEKrQYdyw/exec";


/* ================================
   CAESAR CIPHER ENCRYPTION
================================ */

function encryptCaesar(message, shift) {

    let result = "";

    shift = Number(shift);

    for (let i = 0; i < message.length; i++) {

        const char = message[i];

        // Encrypt uppercase letters
        if (char >= "A" && char <= "Z") {

            const code = char.charCodeAt(0) - 65;

            const encryptedCode =
                (code + shift) % 26;

            result +=
                String.fromCharCode(
                    encryptedCode + 65
                );

        }

        // Encrypt lowercase letters
        else if (char >= "a" && char <= "z") {

            const code = char.charCodeAt(0) - 97;

            const encryptedCode =
                (code + shift) % 26;

            result +=
                String.fromCharCode(
                    encryptedCode + 97
                );

        }

        // Keep spaces, numbers, punctuation
        else {

            result += char;
        }
    }

    return result;
}


/* ================================
   CAESAR CIPHER DECRYPTION
================================ */

function decryptCaesar(ciphertext, shift) {

    let result = "";

    shift = Number(shift);

    for (let i = 0; i < ciphertext.length; i++) {

        const char = ciphertext[i];

        // Decrypt uppercase letters
        if (char >= "A" && char <= "Z") {

            const code = char.charCodeAt(0) - 65;

            const decryptedCode =
                (code - shift + 26) % 26;

            result +=
                String.fromCharCode(
                    decryptedCode + 65
                );

        }

        // Decrypt lowercase letters
        else if (char >= "a" && char <= "z") {

            const code = char.charCodeAt(0) - 97;

            const decryptedCode =
                (code - shift + 26) % 26;

            result +=
                String.fromCharCode(
                    decryptedCode + 97
                );

        }

        // Keep spaces, numbers, punctuation
        else {

            result += char;
        }
    }

    return result;
}


/* ================================
   ENCRYPT & POST
================================ */

document
    .getElementById("encryptButton")
    .addEventListener("click", async function () {

        const message =
            document.getElementById("message").value.trim();

        const shift =
            document.getElementById("key").value.trim();


        /* =========================
           MESSAGE VALIDATION
        ========================= */

        if (!message) {

            alert("Please enter a message.");

            return;
        }


        /* =========================
           SHIFT VALIDATION
        ========================= */

        if (shift === "") {

            alert("Please enter a shift value.");

            return;
        }


        const shiftNumber =
            Number(shift);


        if (
            !Number.isInteger(shiftNumber) ||
            shiftNumber < 1 ||
            shiftNumber > 25
        ) {

            alert(
                "The shift value must be a whole number from 1 to 25."
            );

            return;
        }


        /* =========================
           ENCRYPT MESSAGE
        ========================= */

        const ciphertext =
            encryptCaesar(
                message,
                shiftNumber
            );


        console.log("Plaintext:", message);
        console.log("Shift:", shiftNumber);
        console.log("Ciphertext:", ciphertext);


        /* =========================
           SEND TO GOOGLE APPS SCRIPT
        ========================= */

        try {

            const response =
                await fetch(APPS_SCRIPT_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify({

                        ciphertext: ciphertext,

                        plaintext: message,

                        key: shiftNumber

                    })

                });


            const result =
                await response.json();


            /* =========================
               SERVER RESPONSE
            ========================= */

            if (result.success) {

                alert(
                    "Message encrypted and posted successfully!"
                );


                document
                    .getElementById("message")
                    .value = "";


                document
                    .getElementById("key")
                    .value = "";


                loadMessages();

            } else {

                alert(
                    "Error: " +
                    result.error
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the server. " +
                "Check your Apps Script URL and deployment."
            );
        }

    });


/* ================================
   LOAD MESSAGES
================================ */

async function loadMessages() {

    const feed =
        document.getElementById("messageFeed");


    feed.innerHTML = `
        <div class="loading-state">

            <div class="loading-spinner"></div>

            <p>
                Loading encrypted transmissions...
            </p>

        </div>
    `;


    try {

        const response =
            await fetch(APPS_SCRIPT_URL);


        const data =
            await response.json();


        /* =========================
           CHECK SERVER RESPONSE
        ========================= */

        if (!data.success) {

            feed.innerHTML =
                "<p>Could not load messages.</p>";

            return;
        }


        /* =========================
           NO MESSAGES
        ========================= */

        if (
            !data.messages ||
            data.messages.length === 0
        ) {

            feed.innerHTML =
                "<p>No encrypted messages yet.</p>";

            return;
        }


        /* =========================
           CLEAR FEED
        ========================= */

        feed.innerHTML = "";


        /* =========================
           DISPLAY NEWEST FIRST
        ========================= */

        data.messages
            .reverse()
            .forEach(function (message) {

                const card =
                    document.createElement("div");


                card.className =
                    "message-item";


                /* =====================
                   HEADER
                ===================== */

                const header =
                    document.createElement("div");


                header.className =
                    "message-item-header";


                const title =
                    document.createElement("strong");


                title.textContent =
                    "ENCRYPTED TRANSMISSION";


                const algorithm =
                    document.createElement("span");


                algorithm.textContent =
                    "CAESAR / ROT";


                header.appendChild(title);

                header.appendChild(algorithm);


                /* =====================
                   CIPHERTEXT
                ===================== */

                const ciphertext =
                    document.createElement("div");


                ciphertext.className =
                    "encrypted-message";


                ciphertext.textContent =
                    message.ciphertext;


                /* =====================
                   SHIFT INPUT
                ===================== */

                const inputWrapper =
                    document.createElement("div");


                inputWrapper.style.marginTop =
                    "15px";


                const shiftInput =
                    document.createElement("input");


                shiftInput.type =
                    "number";


                shiftInput.min =
                    "1";


                shiftInput.max =
                    "25";


                shiftInput.placeholder =
                    "Enter shift value";


                shiftInput.style.width =
                    "100%";


                shiftInput.style.padding =
                    "12px";


                shiftInput.style.marginBottom =
                    "10px";


                shiftInput.style.background =
                    "#0d1117";


                shiftInput.style.color =
                    "#f2f4f7";


                shiftInput.style.border =
                    "1px solid #252d38";


                shiftInput.style.borderRadius =
                    "6px";


                /* =====================
                   DECRYPT BUTTON
                ===================== */

                const decryptButton =
                    document.createElement("button");


                decryptButton.textContent =
                    "Decrypt Message";


                decryptButton.style.padding =
                    "10px 18px";


                decryptButton.style.border =
                    "1px solid #d6a84f";


                decryptButton.style.background =
                    "transparent";


                decryptButton.style.color =
                    "#d6a84f";


                decryptButton.style.borderRadius =
                    "6px";


                decryptButton.style.cursor =
                    "pointer";


                /* =====================
                   RESULT
                ===================== */

                const result =
                    document.createElement("div");


                result.className =
                    "decrypt-result";


                result.style.marginTop =
                    "15px";


                result.style.padding =
                    "12px";


                result.style.background =
                    "#0d1117";


                result.style.border =
                    "1px solid #252d38";


                result.style.borderRadius =
                    "6px";


                result.style.display =
                    "none";


                /* =====================
                   DECRYPT EVENT
                ===================== */

                decryptButton.addEventListener(
                    "click",
                    function () {

                        const shift =
                            shiftInput.value.trim();


                        if (shift === "") {

                            alert(
                                "Please enter a shift value."
                            );

                            return;
                        }


                        const shiftNumber =
                            Number(shift);


                        if (
                            !Number.isInteger(
                                shiftNumber
                            ) ||
                            shiftNumber < 1 ||
                            shiftNumber > 25
                        ) {

                            alert(
                                "The shift value must be a whole number from 1 to 25."
                            );

                            return;
                        }


                        const plaintext =
                            decryptCaesar(
                                message.ciphertext,
                                shiftNumber
                            );


                        result.textContent =
                            "Decrypted message: " +
                            plaintext;


                        result.style.display =
                            "block";

                    }
                );


                /* =====================
                   BUILD CARD
                ===================== */

                inputWrapper.appendChild(
                    shiftInput
                );


                inputWrapper.appendChild(
                    decryptButton
                );


                card.appendChild(
                    header
                );


                card.appendChild(
                    ciphertext
                );


                card.appendChild(
                    inputWrapper
                );


                card.appendChild(
                    result
                );


                feed.appendChild(
                    card
                );

            });

    } catch (error) {

        console.error(error);

        feed.innerHTML =
            "<p>Could not connect to the message server.</p>";

    }

}


/* ================================
   LOAD MESSAGES ON PAGE START
================================ */

loadMessages();
