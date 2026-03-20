const userId = "mihir";

// ===== Update Wallet =====
async function updateWallet(){
  const res = await fetch(`/qcompute/wallet/${userId}`);
  const data = await res.json();

  document.getElementById("earnings").innerText =
    "$" + data.balance.toFixed(2);
}

// ===== Load Transactions =====
async function loadTransactions(){
  const res = await fetch(`/qcompute/transactions/${userId}`);
  const data = await res.json();

  const ul = document.getElementById("tx");
  ul.innerHTML = "";

  data.reverse().forEach(t => {
    const li = document.createElement("li");
    li.innerText = `+$${t.reward.toFixed(2)} — ${new Date(t.time).toLocaleTimeString()}`;
    ul.appendChild(li);
  });
}

// ===== Start Worker =====
async function start(){

  while(true){

    const res = await fetch("/qcompute/tasks");
    const tasks = await res.json();

    if(tasks.length === 0){
      await new Promise(r => setTimeout(r, 1000));
      continue;
    }

    const task = tasks[0];

    const result = task.number * 2;

    const submit = await fetch("/qcompute/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        taskId: task.id,
        result,
        userId
      })
    });

    const data = await submit.json();

    if(data.success){
      updateWallet();
      loadTransactions();
    }

  }

}

// ===== Withdraw =====
async function withdraw(){

  const res = await fetch("/qcompute/withdraw",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ userId })
  });

  const data = await res.json();

  alert(data.message || data.error);

  updateWallet();
}

// ===== Auto Refresh =====
setInterval(() => {
  updateWallet();
  loadTransactions();
}, 3000);

// Initial load
updateWallet();
loadTransactions();
