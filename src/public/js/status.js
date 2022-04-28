//define to loop every seconds
setInterval(makeTable,5000)
var GlobalVar;
setInterval(function(){
  try{
    var distance = Date.now() - new Date(GlobalVar.LastUpdated).getTime();
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("updateTime").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
  }catch(err){
    console.error("something went wrong: ",err)
  }
},500)
      


//on load it will call the script 
    makeTable()
    async function makeTable(){
      //calls api
      fetch("/api/status").then(response => response.json()).then(Stuff => {
      var table="";
      GlobalVar = Stuff;
      //pushes into table
      Stuff.Port.forEach(element => {
        var type;
        //check stat then asssign color
        if(element.Status == "Up"){
          type = "bg-success"
        }else{
          type = "bg-danger"
        }
        //formats data for table
        table += 
          `<tr ${`class="${type}"`}>
            <th scope="row">${element.Port}</th>
            <td>${element.Name}</td>
            <td>${element.Status}</td>
          </tr>`
      });
      //displays table and otehr data
      document.getElementById("table").innerHTML = table

      var date = new Date(Stuff.ServerTime)
      
      document.getElementById("time").innerHTML = (`${date}`)
      //cpu bar
      var cpu = document.getElementById("cpu")
      cpu.innerHTML = `${Stuff.CPU}%`
      cpu.style.width = `${Stuff.CPU}%`
      //ram bar
      var ram = document.getElementById("ram")
      ram.innerHTML = `${parseFloat(Stuff.Ram.used).toFixed(2)}/${parseFloat(Stuff.Ram.total).toFixed(2)}${Stuff.Ram.unit}`
      ram.style.width= `${((Stuff.Ram.used/Stuff.Ram.total)*100).toFixed(2)}%`
    }).catch(console.error);
    }