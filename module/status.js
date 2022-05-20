const stats = require('pc-stats')
const fetch = require('cross-fetch')
var {portList,script,url} = require('../statusConfig.json')
const find = require('find-process')
var serverStats = {}

portList.forEach(Element => {
    Element.Status = "Unknown"
});

module.exports = async(test) => {
    if(script){
        try{
            serverStats = fetch(url).then(res => {
                if(res.stats >= 400){return}
                return res.json()
            })
        }catch{
            console.log("external api had issues")
        }
    }else{
        await Update()
    }
    return serverStats
}

async function Update(){
    var ports = ""
    var count = 0
    portList.forEach(async data =>{
        var status = ""
        const type = (typeof data.condition).toString()
        switch (type){
            case "number":
                var list = await find('port',data.condition)
                if(ports != ""){ports += ","}
                if (!list.length) {status = "Down"} else {status = "Up"};ports += `{"Name":"${data.Name}","Port":${data.condition},"Status":"${status}"}`;
                break
            case "string":
                var list = await find('name', data.condition,data.extra || false)
                if(ports != ""){ports += ","}
                if (!list.length) {status = "Down"} else {status = "Up"};ports += `{"Name":"${data.Name}","Port":null,"Status":"${status}"}`;
                break
        }
        count++
        if(portList.length == count)final(ports)
    })
}

function final(ports){
    stats().then((stats) => {
        var total = 0
        stats.cpu.threads.forEach(thread =>{total += thread.usage})
        try{total = total/stats.cpu.threads.length}catch{}
        var js = `{"CPU":${Math.round(total)},"Ram":{"total":${parseFloat(stats.ram.total)},"used":${Number(Math.round((parseFloat(stats.ram.total)-parseFloat(stats.ram.free))+'e2')+'e-2')},"unit":"${stats.ram.unit}"},"Port":[${ports}]}`
        serverStats = JSON.parse(js)
    }).catch((err) => {
        console.log(err)
    })
}