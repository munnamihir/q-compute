let total = 0;

async function start(){

  while(true){

    const res = await fetch("/qcompute/tasks");
    const tasks = await res.json();

    if(tasks.length === 0) continue;

    const task = tasks[0];

    const result = task.number * 2;

    const submit = await fetch("/qcompute/submit",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({
        taskId: task.id,
        result
      })
    });

    const data = await submit.json();

    if(data.success){
      total += data.reward;
      document.getElementById("earnings").innerText =
        "$" + total.toFixed(2);
    }

  }

}
