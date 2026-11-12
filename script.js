
const UPI_ID="dharmed13@ibl";
const BUSINESS="Bajrang Internet Services Palera";
const PHONE="9893705006";
function toggleMenu(){document.querySelector('nav')?.classList.toggle('open')}
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function payUPI(amount,note){
 const url="upi://pay?pa="+encodeURIComponent(UPI_ID)+"&pn="+encodeURIComponent(BUSINESS)+"&am="+encodeURIComponent(amount)+"&cu=INR&tn="+encodeURIComponent(note);
 window.location.href=url;
}
function sendWhatsApp(text){window.open("https://wa.me/91"+PHONE+"?text="+encodeURIComponent(text),"_blank")}
function bookConnection(form){
 const d=Object.fromEntries(new FormData(form).entries());
 if(!d.name||!d.mobile||!d.address||!d.plan){alert("Please fill name, mobile number, address and plan.");return}
 if(!/^[6-9]\d{9}$/.test(d.mobile)){alert("Enter a valid 10-digit Indian mobile number.");return}
 const amount=Number(d.amount); if(!amount){alert("Please select a valid plan.");return}
 const note="New connection booking - "+d.name+" - "+d.plan;
 const msg=`NEW CONNECTION BOOKING\nName: ${d.name}\nMobile: ${d.mobile}\nAddress: ${d.address}\nPlan: ${d.plan}\nAmount: ${money(amount)}\nPlease confirm availability and booking.`;
 sessionStorage.setItem("pendingBooking",msg);
 if(confirm("Your booking details are ready. Press OK to open your UPI app and pay "+money(amount)+". After payment, return to the website and send your booking details on WhatsApp.")){payUPI(amount,note);setTimeout(()=>sendWhatsApp(msg),1200)}
}
function renewPlan(form){
 const d=Object.fromEntries(new FormData(form).entries());
 if(!d.mobile||!d.plan){alert("Enter your registered mobile number and select a renewal plan.");return}
 if(!/^[6-9]\d{9}$/.test(d.mobile)){alert("Enter a valid 10-digit registered mobile number.");return}
 const amount=Number(d.amount); if(!amount){alert("Select a valid renewal plan.");return}
 if(confirm("Open your UPI app to pay "+money(amount)+"? Your renewal will be processed after payment is received and verified.")){payUPI(amount,"Renewal - "+d.mobile+" - "+d.plan)}
}
function dishtvPay(form){
 const d=Object.fromEntries(new FormData(form).entries());
 if(!d.name||!d.mobile||!d.kind){alert("Please complete all required fields.");return}
 if(!/^[6-9]\d{9}$/.test(d.mobile)){alert("Enter a valid 10-digit mobile number.");return}
 const amount=Number(d.amount);
 const msg=`DishTV ${d.kind}\nName: ${d.name}\nMobile: ${d.mobile}\nType: ${d.kind}\nAmount: ${money(amount)}\nPlease confirm.`;
 if(confirm("Proceed to pay "+money(amount)+" through UPI?")){payUPI(amount,"DishTV "+d.kind+" - "+d.mobile);setTimeout(()=>sendWhatsApp(msg),1200)}
}
function setAmount(select){const opt=select.options[select.selectedIndex];const amount=opt?.dataset.amount;const input=select.form?.querySelector('[name="amount"]');if(input)input.value=amount||""}
function initForms(){document.querySelectorAll("select[data-amount-select]").forEach(s=>{s.addEventListener("change",()=>setAmount(s));if(s.value)setAmount(s)})}
document.addEventListener("DOMContentLoaded",initForms);
