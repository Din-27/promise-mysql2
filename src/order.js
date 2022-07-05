const pool = require('../config/config')

exports.createOrder = async(req, res) => {
    const {nama, warna, id, co, validasi} = req.body
    await pool.query('start transaction')
    .then((result) => {
        try {
            const v_detail_order = pool.query(`select * from detail_order where nama='${nama}' and warna='${warna}' and id=${id} and status='SIAP KIRIM'`)
            if(v_detail_order.length > 0){
                return res.send({
                    status : 'Data sudah ada dan siap kirim'
                })
            }else{
                const v_detail_order = pool.query(`select * from detail_order where nama='${nama}' and warna='${warna}' and id=${id} and status='MENUNGGU ADMIN'`)
                if(v_detail_order.length > 0){
                    if(co === ""){
                        return res.send({
                            status : 'data sudah ada, apakah ingin checkout ?'
                        })
                    }else if(co === 'no'){
                        return res.send({
                            status : 'silahkan order yang lain'
                        })
                    }else if(co === 'iya'){
                        if(validasi === ""){
                            return res.send({
                                status : 'Apakah data sudah benar ? jika iya klik tombol iya'
                            })
                        }else if(validasi === "iya"){
                            pool.query(`UPDATE detail_order SET status='SIAP KIRIM' WHERE nama='${nama}' and warna='${warna}' and id=${id}`).then((result) => {
                                    pool.query('commit').then((result) => {
                                        console.log('success update!');
                                        return res.send({
                                            status : 'Selamat anda sudah checkout'
                                        })
                                    }).catch((err) => {
                                        pool.query('rollback').then((result) => {
                                            console.log('failed update!');
                                            return res.send({
                                                status : 'anda gagal checkout'
                                            })
                                        }).catch((err) => {throw err});
                                    })
                                }).catch((err) => {throw err})
                        }else if(validasi === 'no'){
                            return res.send({
                                status : 'silhakan order yang lain'
                            })
                        }
                    }
                }else{
                    if(co === ""){
                        return res.send({
                            status : 'apakah ingin memasukan barang ke trolly ?'
                        })
                    }else if(co === "no"){
                        return res.send({
                            status : 'silahkan order yang lain'
                        })
                    }else if(co === "iya"){
                        if(validasi === ""){
                            return res.send({
                                status : 'Apakah data sudah benar ? jika iya klik tombol iya'
                            })
                        }else if(validasi === 'iya'){
                            pool.query(`INSERT INTO detail_order (id, nama, warna, status) VALUES (0,'${nama}', '${warna}', 'MENUNGGU ADMIN')`).then((result) => {
                                pool.query('commit').then((result) => {
                                    console.log('success update!');
                                    return res.send({
                                        status : 'Selamat anda sudah checkout'
                                    })
                                }).catch((err) => {throw err})
                                console.log('success in!');
                            }).catch((err) => {
                                pool.query('rollback').then((result) => {
                                    console.log('failed update!');
                                    return res.send({
                                        status : 'anda gagal checkout'
                                    })
                                }).catch((err) => {throw err});
                            })
                        }else if(validasi === 'no'){
                            return res.send({
                                status : 'silhakan order yang lain'
                            })
                        }
                    }
                }
                
            }
        } catch (error) {
            console.log(error)
            res.send({
                status : 'GAGAL'
            })
        }
    }).catch((err) => {throw err})
}