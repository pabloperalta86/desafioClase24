process.on('message', cantDatos => {
    const range = 1000
    if(cantDatos == null){ 
        cantDatos=100000000
    }

    const numbersObj = {};
    for (let i = 0; i < cantDatos; i++) {
        const numero = parseInt(Math.random() * range) + 1
        if (!numbersObj[numero]) numbersObj[numero] = 0;
        numbersObj[numero]++;
    }
    process.send(numbersObj);
})