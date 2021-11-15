const { Client } = require('pg')
const plotlib = require("nodeplotlib")

const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'payal',
    user: 'payal',
    password: '',
})

client.connect((err) => {
    if (err) {
        console.log(err)
    }

    console.log("Connected")
});

client.query("select avg(temperature),interval_group from (select id,'epoch'::timestamptz + '60 seconds'::interval * (extract(epoch from time)::int4 / 60) as interval_group,temperature from machine where machine_name='Fanuc' and time  >= NOW() - INTERVAL '1 HOUR')t1 Group BY interval_group order by interval_group;", (err, res) => {
    if (!err) {
        
        const arr = [];
        const arr1 = [];
        for (let index = 0; index < res.rows.length; index++) {

            const element = res.rows[index].interval_group;
            const temp = res.rows[index].avg;
            arr.push(temp)
            arr1.push(element)
        }
        const data = [{
            x: arr1,
            y: arr,
            type: 'line'
        }];
        plotlib.plot(data);



    } else {
        console.log(err.message)
    }
    client.end();
})


