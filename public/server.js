const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // 靜態檔案目錄

// 連接到資料庫
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // 替換為你的 MySQL 使用者
    password: '123456', // 替換為你的 MySQL 密碼
    database: 'team'  // 替換為你的資料庫名稱
});

// 註冊路由
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // 檢查使用者是否已存在
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            res.status(409).send('帳號已存在！');
        } else {
            // 將密碼進行哈希處理
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;

                // 儲存使用者資料
                db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash], (error) => {
                    if (error) throw error;

                    res.send('註冊成功！');
                });
            });
        }
    });
});

// 登入路由
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (isMatch) {
                    // 登入成功，重定向到已登入頁面
                    res.redirect('/welcome.html');
                } else {
                    // 密碼錯誤
                    res.status(401).send('帳號或密碼錯誤！');
                }
            });
        } else {
            // 使用者不存在
            res.status(401).send('帳號或密碼錯誤！');
        }
    });
});

// 已登入頁面路由
app.get('/welcome.html', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="zh-Hant">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>已登入頁面</title>
        </head>
        <body>
            <h1>歡迎來到已登入頁面！</h1>
            <p>您已成功登入。</p>
        </body>
        </html>
    `);
});

// 啟動伺服器
app.listen(3306, () => {
    console.log('Server is running on port 3306');
});
