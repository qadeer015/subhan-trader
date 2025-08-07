function showAlert(message, type="success"){
  const alertContainer = document.createElement("div");
  alertContainer.classList.add("alertContainer","position-fixed");
  
  const messageContanier = document.createElement("div");
  messageContanier.classList.add("messageContainer", "alert", `alert-${type}`);

  messageContanier.textContent = message;

  alertContainer.appendChild(messageContanier);
  document.body.appendChild(alertContainer);

  setTimeout(()=>{
        messageContanier.remove();
        alertContainer.remove();
  }, 3000)
}
