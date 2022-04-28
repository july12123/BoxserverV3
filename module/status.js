const stats = require('pc-stats')
var {portList,script} = require('../statusConfig.json')
const detect = require('detect-port');

var serverStats = {}

portList.forEach(Element => {
    Element.Status = "Unknown"
});

module.exports = async(test) => {
    await Update()
    return serverStats
}

async function Update(){
    var ports = ""
    portList.forEach(data =>detect(data.Port).then((_port) => {
        var status = ""
        if(ports!= ""){
            ports += ","
        }
        if (data.Port == _port) {
            status = "Down"
        } else {
            status = "Up"
        }
        ports += `{"Name":"${data.Name}","Port":${data.Port},"Status":"${status}"}`
    }));
    stats().then((stats) => {
        var total = 0
        stats.cpu.threads.forEach(thread =>{
            total += thread.usage
        })
        try{total = total/stats.cpu.threads.length}catch{}
        serverStats = JSON.parse(`{"CPU":${Math.round(total)},"Ram":{"total":${parseFloat(stats.ram.total)},"used":${Number(Math.round((parseFloat(stats.ram.total)-parseFloat(stats.ram.free))+'e2')+'e-2')},"unit":"${stats.ram.unit}"},"Port":[${ports}]}`)
    }).catch((err) => {
        console.log(err)
    })
}