export const dealerBalanceAdded = (option: {
  code: string;
  dealerName: string;
  balance: number;
  senderBank: string;
}) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Defender Doors</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
    }
    .body {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
    }
    .footer {
      font-size: 12px;
      color: #999;
      margin-top: 30px;
      text-align: center;
    }
    a.button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://your-logo-url.com/logo.png" alt="Defender Doors Logo" width="150" />
    </div>
    <div class="header">Dealer Balance Added</div>
    <div class="body">
      <p>Dear ${option?.dealerName},</p>
      <p>You have received <strong>${option?.balance} Taka</strong> in your account <strong>${option?.code}</strong> from <strong>${option?.senderBank}</strong>.</p>
      <p>Thank you for choosing Defender Doors.</p>
      <a class="button" href="https://portal.tradeasiahrc.com">View Transaction</a>
    </div>
    <div class="footer">
      &copy; 2025 Trade Asia HRC Ltd. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
};
