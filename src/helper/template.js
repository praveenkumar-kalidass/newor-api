const { VERIFICATION_MAIL } = require('../constant');

const getVerificationMail = (data) => `<div>
  <h1 style="margin-bottom:0;text-align:center">Welcome to NEWOR!</h1>
  <div style="text-align:center">
    <img style="width: 480px;height:480px" src="${data.baseURL}/public/newor-verify.png" />
  </div>
  <div style="text-align:center">
    <span>
      Please click on the <a href="${data.baseURL + data.link}">link</a> to verify your email with NEWOR 
    </span>
    <p>OR</p>
    <span>
      Please paste the following url in your browser for verification,
    </span>
    <p style="text-decoration:underline">
      ${data.baseURL + data.link}
    </p>
  </div>
</div>`;

const getVerificationStatus = (data) => `<div>
  <h1 style="margin-bottom:0;text-align:center">${data.success ? VERIFICATION_MAIL.SUCCESS : VERIFICATION_MAIL.FAILURE}</h1>
  <div style="text-align:center">
    <img style="width: 480px;height:480px" src="${data.baseURL}/public/${data.success ? 'newor-success' : 'newor-failure'}.png" />
  </div>
</div>
`;

module.exports = { getVerificationMail, getVerificationStatus };
