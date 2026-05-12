const http = require('http');

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch(e) {
                    resolve({ statusCode: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log("=== Memulai Pengujian API ===");

        // 1. Register Owner
        console.log("\n[1] Mendaftarkan Owner...");
        const ownerEmail = `owner${Date.now()}@test.com`;
        const regOwnerRes = await request('POST', '/api/auth/register', {
            name: 'Bapak Owner',
            email: ownerEmail,
            password: 'password123',
            role: 'owner'
        });
        console.log("Response:", regOwnerRes.body);

        // 2. Register Renter
        console.log("\n[2] Mendaftarkan Renter...");
        const renterEmail = `renter${Date.now()}@test.com`;
        const regRenterRes = await request('POST', '/api/auth/register', {
            name: 'Mas Renter',
            email: renterEmail,
            password: 'password123',
            role: 'renter'
        });
        console.log("Response:", regRenterRes.body);

        // 3. Login Owner
        console.log("\n[3] Login Owner...");
        const loginOwnerRes = await request('POST', '/api/auth/login', {
            email: ownerEmail,
            password: 'password123'
        });
        const ownerToken = loginOwnerRes.body.data.token;
        console.log("Token Owner didapatkan.");

        // 4. Login Renter
        console.log("\n[4] Login Renter...");
        const loginRenterRes = await request('POST', '/api/auth/login', {
            email: renterEmail,
            password: 'password123'
        });
        const renterToken = loginRenterRes.body.data.token;
        console.log("Token Renter didapatkan.");

        // 5. Create Item as Owner
        console.log("\n[5] Owner menambahkan barang...");
        const itemRes = await request('POST', '/api/items', {
            name: 'Kamera Canon EOS R5',
            description: 'Kamera mirrorless profesional',
            daily_price: 500000
        }, ownerToken);
        console.log("Response:", itemRes.body);
        const itemId = itemRes.body.data.id;

        // 6. View Available Items
        console.log("\n[6] Mengambil daftar barang tersedia...");
        const itemsList = await request('GET', '/api/items', null, renterToken);
        console.log("Response:", itemsList.body);

        // 7. Renter meminjam barang
        console.log("\n[7] Renter meminjam barang...");
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + 3); // sewa 3 hari
        
        const rentalRes = await request('POST', '/api/rentals', {
            item_id: itemId,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        }, renterToken);
        console.log("Response:", rentalRes.body);
        const rentalId = rentalRes.body.data.id;

        // 8. Renter meminjam barang lagi (seharusnya gagal)
        console.log("\n[8] Test meminjam barang yang sedang disewa...");
        const failRentalRes = await request('POST', '/api/rentals', {
            item_id: itemId,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        }, renterToken);
        console.log("Response:", failRentalRes.body); // expected fail

        // 9. Owner mengkonfirmasi pengembalian
        console.log("\n[9] Owner mengkonfirmasi pengembalian...");
        const completeRes = await request('POST', `/api/rentals/${rentalId}/complete`, null, ownerToken);
        console.log("Response:", completeRes.body);

        console.log("\n=== Pengujian Selesai ===");
        process.exit(0);

    } catch (error) {
        console.error("Error during testing:", error);
        process.exit(1);
    }
};

runTests();
 
