import config from "#src/config/config";
import nodemailer from "nodemailer";
import oauthClient from "#src/utils/oauth2";

const accessToken = oauthClient.getAccessToken();

const createTransport = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.GMAIL_USERNAME,
      clientId: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      refreshToken: config.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

const getVerifyEmail = (toEmail, url, verifyToken) => {
  return {
    from: config.GMAIL_USERNAME,
    to: toEmail,
    subject: "[EatWell] Email verification",
    html: `
        <div style="
            text-align: center; 
            height: 256px;
            width: 512px;
            background-color: hsl(125, 29%, 75%); 
            padding: 2em; 
            justify-content: center;"
        >
            <h1>EatWell - Your Health Assistant</h1>
            <h3>Thank you for registering</h3>
            <div>
                <a href="${url}/verify/${verifyToken}">
                    <button style="
                        font-weight: bold; 
                        padding: 2em; 
                        background-color: #18aeac; 
                        color: #fff; 
                        width: 512px; 
                        border: none;"
                    >
                        Click here to activate your account
                    </button>
                </a>
            </div>
            <div>Sent at ${new Date().toUTCString()}</div>
        </div>`,
  };
};

const getOTPEmail = (toEmail, otp) => {
  return {
    from: config.GMAIL_USERNAME,
    to: toEmail,
    subject: "[EatWell] Password Change",
    html: `
        <div style="
            text-align: center; 
            height: 256px;
            width: 512px;
            background-color: hsl(125, 29%, 75%); 
            padding: 2em; 
            justify-content: center;"
        >
            <h1>EatWell - Your Health Assistant</h1>
            <h3>This is your recovery code, please do not share it with anyone</h3>
            <div>
                    <button style="
                        font-weight: bold; 
                        padding: 2em; 
                        background-color: #18aeac; 
                        color: #fff; 
                        width: 512px; 
                        border: none;"
                    >
                        ${otp}
                    </button>
            </div>
            <div>Sent at ${new Date().toUTCString()}</div>
        </div>`,
  };
};

const getAlertEmail = (toEmail) => {
  return {
    from: config.GMAIL_USERNAME,
    to: toEmail,
    subject: "[EatWell] Email Alert",
    html: `
        <div style="
            text-align: center; 
            height: 256px;
            width: 512px;
            background-color: hsl(125, 29%, 75%); 
            padding: 2em; 
            justify-content: center;"
        >
            <h1>EatWell - Your Health Assistant</h1>
            <h3>Thank you for registering</h3>
            <div>
                <a >
                    <button style="
                        font-weight: bold; 
                        padding: 2em; 
                        background-color: #18aeac; 
                        color: #fff; 
                        width: 512px; 
                        border: none;"
                    >
                        Click here to activate your account
                    </button>
                </a>
            </div>
            <div>Sent at ${new Date().toUTCString()}</div>
        </div>`,
  };
};

export { createTransport, getVerifyEmail, getOTPEmail, getAlertEmail };
