
const UPI_ID = "dharmend13@ibl";
const BUSINESS = "Bajrang Internet Services Palera";
const PHONE = "9893705006";

function toggleMenu() {
  document.querySelector("nav")?.classList.toggle("open");
}

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function payUPI(amount, note) {
  const url = "upi://pay?pa=" + encodeURIComponent(UPI_ID) +
    "&pn=" + encodeURIComponent(BUSINESS) +
    "&am=" + encodeURIComponent(Number(amount).toFixed(2)) +
    "&cu=INR&tn=" + encodeURIComponent(note);

  window.location.href = url;
}

function sendWhatsApp(text) {
  window.open(
    "https://wa.me/91" + PHONE + "?text=" + encodeURIComponent(text),
    "_blank"
  );
}

function showPaymentOptions(amount, note, afterPayment) {
  amount = Number(amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Invalid payment amount.");
    return;
  }

  document.getElementById("payment-modal")?.remove();

  const upiUrl = "upi://pay?pa=" + encodeURIComponent(UPI_ID) +
    "&pn=" + encodeURIComponent(BUSINESS) +
    "&am=" + encodeURIComponent(amount.toFixed(2)) +
    "&cu=INR&tn=" + encodeURIComponent(note);

  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=" +
    encodeURIComponent(upiUrl);

  const modal = document.createElement("div");
  modal.id = "payment-modal";

  modal.innerHTML = `
    <div style="
      position:fixed;inset:0;background:#0009;z-index:99999;
      display:flex;align-items:center;justify-content:center;
      padding:15px;font-family:Arial,sans-serif;">
      <div style="
        background:white;color:#222;width:100%;max-width:380px;
        border-radius:16px;padding:22px;text-align:center;
        max-height:90vh;overflow:auto;">
        <h2 style="margin-top:0;color:#0755a5">Choose Payment Method</h2>
        <h2 style="color:#138b43">${money(amount)}</h2>

        <button id="pay-upi" style="
          width:100%;padding:14px;background:#0875d1;color:white;
          border:0;border-radius:8px;font-size:16px;margin:7px 0;">
          Pay using UPI ID
        </button>

        <div style="padding:12px;background:#f1f5f9;border-radius:8px;">
          <b>UPI ID</b><br>${UPI_ID}
          <button id="copy-upi" style="margin:8px;padding:7px 15px;">
            Copy UPI ID
          </button>
        </div>

        <div style="padding:12px;background:#f1f5f9;border-radius:8px;margin-top:10px;">
          <b>Pay using mobile number</b><br>
          ${PHONE}
          <button id="copy-phone" style="margin:8px;padding:7px 15px;">
            Copy mobile number
          </button>
          <p style="font-size:12px;color:#555;margin-bottom:0;">
            Open your UPI app and search this number to find the registered
            payment account. Confirm the recipient name before paying.
          </p>
        </div>

        <div style="margin-top:15px;">
          <b>Scan QR code to pay</b><br>
          <img src="${qrUrl}" alt="UPI payment QR code"
            style="width:220px;height:220px;max-width:100%;margin-top:8px;">
          <p style="font-size:12px;color:#555;">
            Scan using another phone's UPI app.
          </p>
        </div>

        <button id="close-payment" style="
          width:100%;padding:12px;background:#ddd;color:#222;
          border:0;border-radius:8px;margin-top:12px;">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("pay-upi").onclick = () => {
    if (afterPayment) afterPayment();
    payUPI(amount, note);
  };

  document.getElementById("copy-upi").onclick = () => {
    copyText(UPI_ID);
  };

  document.getElementById("copy-phone").onclick = () => {
    copyText(PHONE);
  };

  document.getElementById("close-payment").onclick = () => {
    modal.remove();
  };
}

function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(value)
      .then(() => alert("Copied: " + value))
      .catch(() => alert("Please copy manually: " + value));
  } else {
    alert("Please copy manually: " + value);
  }
}

function bookConnection(form) {
  const d = Object.fromEntries(new FormData(form).entries());

  if (!d.name || !d.mobile || !d.address || !d.plan) {
    alert("Please fill name, mobile number, address and plan.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(d.mobile)) {
    alert("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  const amount = Number(d.amount);

  if (!amount || amount <= 0) {
    alert("Please select a valid plan.");
    return;
  }

  const note = "New connection booking - " + d.name + " - " + d.plan;

  const msg = `NEW CONNECTION BOOKING
Name: ${d.name}
Mobile: ${d.mobile}
Address: ${d.address}
Plan: ${d.plan}
Amount: ${money(amount)}
Please confirm availability and booking.`;

  sessionStorage.setItem("pendingBooking", msg);

  if (confirm(
    "Your booking details are ready. Continue to payment of " +
    money(amount) + "?"
  )) {
    showPaymentOptions(amount, note, () => {
      setTimeout(() => sendWhatsApp(msg), 1200);
    });
  }
}

function renewPlan(form) {
  const d = Object.fromEntries(new FormData(form).entries());

  if (!d.mobile || !d.plan) {
    alert("Enter your registered mobile number and select a renewal plan.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(d.mobile)) {
    alert("Enter a valid 10-digit registered mobile number.");
    return;
  }

  const amount = Number(d.amount);

  if (!amount || amount <= 0) {
    alert("Select a valid renewal plan.");
    return;
  }

  if (confirm(
    "Open payment options for " + money(amount) +
    "? Your renewal will be processed after payment is received and verified."
  )) {
    showPaymentOptions(
      amount,
      "Renewal - " + d.mobile + " - " + d.plan
    );
  }
}

function dishtvPay(form) {
  const d = Object.fromEntries(new FormData(form).entries());

  if (!d.name || !d.mobile || !d.kind) {
    alert("Please complete all required fields.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(d.mobile)) {
    alert("Enter a valid 10-digit mobile number.");
    return;
  }

  const amount = Number(d.amount);

  if (!amount || amount <= 0) {
    alert("Invalid payment amount.");
    return;
  }

  const msg = `DishTV ${d.kind}
Name: ${d.name}
Mobile: ${d.mobile}
Type: ${d.kind}
Amount: ${money(amount)}
Please confirm.`;

  if (confirm("Proceed to payment of " + money(amount) + "?")) {
    showPaymentOptions(
      amount,
      "DishTV " + d.kind + " - " + d.mobile,
      () => setTimeout(() => sendWhatsApp(msg), 1200)
    );
  }
}

function setAmount(select) {
  const opt = select.options[select.selectedIndex];
  const amount = opt?.dataset.amount;
  const input = select.form?.querySelector('[name="amount"]');

  if (input) input.value = amount || "";
}

function initForms() {
  document.querySelectorAll("select[data-amount-select]").forEach(s => {
    s.addEventListener("change", () => setAmount(s));
    if (s.value) setAmount(s);
  });
}

document.addEventListener("DOMContentLoaded", initForms);
