<?php
// 只處理POST請求
/*請求方法檢查 */
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 取得表單欄位並刪除空格
    $name = strip_tags(trim($_POST["name"])); // 數據清理: strip_tags()：移除 HTML 和 PHP 標籤
    $name = str_replace(array("\r", "\n"), array(" ", " "), $name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    // filter_var()：用於過濾和清理電子郵件地址  // trim()：去除字符串前後的空白字符 
    $subject = trim($_POST["subject"]);
    $number = trim($_POST["number"]);
    $message = trim($_POST["message"]);

    // 檢查必要的字段是否為空以及電子郵件格式是否有效
    if (empty($name) or empty($message) or empty($number) or empty($subject) or !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Set a 400 (bad request) response code and exit.
        http_response_code(400);
        echo "Please complete the form and try again.";
        exit;
    }

    // 電子郵件設置    // 更新為目標電子郵件地址
    $recipient = "yourmail@gmail.com";

    // 設定電子郵件主題
    $subject = "New contact from $subject";

    // 建立電子郵件內容
    $email_content = "Name: $name\n";
    $email_content .= "Subject: $subject\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // 建立電子郵件標題
    $email_headers = "From: $name <$email>";

    // 傳送電子郵件
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Set a 200 (okay) response code.
        http_response_code(200);
        echo "Thank You! Your message has been sent.";
    } else {
        // Set a 500 (internal server error) response code.
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }

} else {
    // 不是 POST 請求, set a 403 (forbidden) response code.
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}

?>