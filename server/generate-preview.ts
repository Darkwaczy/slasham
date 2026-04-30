import fs from 'fs';
import { otpTemplate, userWelcomeTemplate, founderWelcomeTemplate } from './src/utils/emailTemplates';

const html = `
<!DOCTYPE html>
<html>
<head>
<title>Email Previews</title>
<style>
  body { background: #e2e8f0; padding: 40px; font-family: sans-serif; }
  .preview-container { margin-bottom: 60px; }
  h2.title { text-align: center; color: #475569; margin-bottom: 20px; }
</style>
</head>
<body>
  <div class="preview-container">
    <h2 class="title">1. OTP Verification Email</h2>
    <div>
      ${otpTemplate('Member', '684294')}
    </div>
  </div>

  <div class="preview-container">
    <h2 class="title">2. Welcome Email</h2>
    <div>
      ${userWelcomeTemplate('Member', 'https://www.slasham.com')}
    </div>
  </div>

  <div class="preview-container">
    <h2 class="title">3. Founder Note</h2>
    <div>
      ${founderWelcomeTemplate('Member')}
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('email-preview.html', html);
console.log('Preview generated at email-preview.html');
