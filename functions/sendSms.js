const axios = require('axios');

module.exports.sendSMS = async (phoneNumber, message) => {
    const xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <mainbody>
    <header>  
      <company dil="TR">Netgsm</company>       
      <usercode>KullaniciAdi</usercode>
      <password>Sifre</password>
      <type>1:n</type>
      <msgheader>Baslik</msgheader>
      <appkey>xxx</appkey>
    </header>
    <body>
      <msg>
        <![CDATA[${message}]]>
      </msg>
      <no>${phoneNumber}</no>
    </body>
  </mainbody>`;

    const headers = { 'Content-Type': 'application/xml' };

    try {
        const response = await axios.post('https://api.netgsm.com.tr/sms/send/xml', xml, { headers });
        console.log('SMS gönderim yanıtı:', response.data);
        return response.data;
    } catch (error) {
        console.error('SMS gönderim hatası:', error);
        throw error;
    }
};


