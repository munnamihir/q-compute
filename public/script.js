// =========================
// GLOBAL STATE
// =========================
let token = localStorage.getItem("token") || "";

// =========================
// LOGIN FUNCTION (AUTO LOGIN FOR NOW)
// =========================
async function login(){

  try {

    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "mihir",
        password: "12345678"
      })
    });

    const text = await res.text();

    console.log("LOGIN RAW RESPONSE:", text);

    const data = JSON.parse(text);

    if (!res.ok) {
      console.error("❌ Login failed:", data);
      return;
    }

    token = data.token;
    localStorage.setItem("token", token);

    console.log("✅ Logged in");

  } catch (err) {
    console.error("🔥 Login crash:", err);
  }
}

// =========================
// WALLET
// =========================
async function updateWallet(){

  try {
    const res = await fetch("/qcompute/wallet", {
      headers: {
        "Authorization": token
      }
    });

    if (!res.ok) {
      console.error("Wallet API failed:", res.status);
      return;
    }

    const data = await res.json();

    document.getElementById("earnings").innerText =
      "$" + Number(data.balance || 0).toFixed(2);

  } catch (err) {
    console.error("Wallet error:", err);
  }
}

// =========================
// TRANSACTIONS
// =========================
async function loadTransactions(){

  try {
    const res = await fetch("/qcompute/transactions", {
      headers: {
        "Authorization": token
      }
    });

    if (!res.ok) {
      console.error("Transactions API failed:", res.status);
      return;
    }

    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("Invalid transactions format:", data);
      return;
    }

    const ul = document.getElementById("tx");
    ul.innerHTML = "";

    data.forEach(t => {
      const li = document.createElement("li");
      li.innerText =
        `+$${Number(t.reward).toFixed(2)} — ${new Date(t.created_at).toLocaleTimeString()}`;
      ul.appendChild(li);
    });

  } catch (err) {
    console.error("Transactions error:", err);
  }
}

// =========================
// WORKER (EARNING ENGINE)
// =========================
async function start(){

  if (!token) {
    alert("Not logged in!");
    return;
  }

  while(true){

    try {
      // GET TASK
      const res = await fetch("/qcompute/task", {
        headers: {
          "Authorization": token
        }
      });

      const task = await res.json();

      if (!task || !task.id) {
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      // SOLVE TASK
      const result = task.number * 2;

      // SUBMIT RESULT
      const submit = await fetch("/qcompute/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify({
          taskId: task.id,
          result
        })
      });

      const data = await submit.json();

      if (data.success) {
        console.log("💰 Earned:", task.reward);

        await updateWallet();
        await loadTransactions();
      }

    } catch (err) {
      console.error("Worker error:", err);
    }

    // small delay (important for CPU + server)
    await new Promise(r => setTimeout(r, 500));
  }
}

// =========================
// WITHDRAW
// =========================
async function withdraw(){

  try {
    const res = await fetch("/qcompute/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();

    alert(data.message || data.error);

    updateWallet();

  } catch (err) {
    console.error("Withdraw error:", err);
  }
}

// =========================
// INIT APP
// =========================
async function init(){

  if (!token) {
    await login(); // WAIT for login
  }

  if (!token) {
    console.error("❌ No token, stopping");
    return;
  }

  await updateWallet();
  await loadTransactions();
}

// Auto start app
init();

// Refresh UI periodically
setInterval(() => {
  updateWallet();
  loadTransactions();
}, 5000);
