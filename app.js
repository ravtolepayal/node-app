const request = require("request")

const { Client } = require('pg')

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
setInterval(() => {
    request({
        url: "https://myfirstiiotapp.herokuapp.com/api/metrics?api_key=5QXTnPPVh62U3x8bRM5K",
        json: true
    }, (err, res, body) => {

        if (body.status == "success") {
            const machineRow = body.data
            const len = machineRow.length

            for (let index = 0; index < len; index++) {
                const t = machineRow[index].time;
                const m = machineRow[index].machine
                const temp = machineRow[index].data[0].value;
                //console.log(data)

                let text = 'INSERT INTO machine(time, machine_name,temperature) VALUES ($1,$2,$3) RETURNING *'
                const values = [t, m, temp]
                // callback
                client.query(text, values, (err, res) => {
                    if (err) {
                        console.log(err.stack)
                    } else {
                        console.log(res.rows[0])
                    }
                })

            }
        }
    })
}, 5000)


