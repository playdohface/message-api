
use lettre::message::Mailbox;
use lettre::transport::smtp::{authentication::Credentials, response::Response};
use lettre::{Message, SmtpTransport, Transport, Address,};
use std::env;
use std::error::Error;



    ///Sends an EMail, assumes environnmentvariables EMAIL and MAILPASSWORD to be set, and smtp.gmail.com as the server
    pub fn simplemail(replyto: String, name: String, message: String ) -> Result<Response, Box<dyn Error>> {
        let creds = Credentials::new(env::var("EMAIL").unwrap(), env::var("MAILPASSWORD").unwrap());
        let address: Address = replyto.parse()?;
        let address2: Address = env::var("EMAIL").unwrap().parse()?;

        let email = Message::builder()
            .from(Mailbox::new(Some("Rusty".to_string()), address))
            .to(Mailbox::new(Some("Kalle".to_string()), address2))
            .subject(format!("A message from your website from {}", &name))
            .body(format!("From: {} <{}> , Message: {}", name, replyto, message))
            .unwrap();

        let mailer = SmtpTransport::relay("smtp.gmail.com")
            .unwrap()
            .credentials(creds)
            .build();

        Ok(mailer.send(&email)?)
    }
