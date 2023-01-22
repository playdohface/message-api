use email::simplemail;
use rocket::form::Form;
use rocket::fs::NamedFile;
use std::path::{Path, PathBuf};
use std::{fs, env};
use rocket::http::ContentType;
use rocket::response::content::RawHtml;
use rust_embed::RustEmbed;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
//use rocket::log::private::debug;

use rocket::{Request, Response};

use rocket::serde::{Deserialize, json::Json};

use std::borrow::Cow;
use std::ffi::OsStr;

mod email;

#[macro_use]
extern crate rocket;




#[derive(RustEmbed)]
#[folder = "static/"]
struct Asset;

#[get("/")]
fn index() -> Option<RawHtml<Cow<'static, [u8]>>> {
  let asset = Asset::get("index.html")?;
  Some(RawHtml(asset.data))
}

#[get("/<file..>")]
fn servestatic(file: PathBuf) -> Option<(ContentType, Cow<'static, [u8]>)> {
  let filename = file.display().to_string();
  let asset = Asset::get(&filename)?;
  let content_type = file
    .extension()
    .and_then(OsStr::to_str)
    .and_then(ContentType::from_extension)
    .unwrap_or(ContentType::Bytes);

  Some((content_type, asset.data))
}



#[derive(Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
struct Msg<'r> {
    name: &'r str,
    email: &'r str,
    message: &'r str,
}

#[post("/msg", data = "<msg>")]
fn msg(msg: Json<Msg<'_>>) -> String {
    let data = msg.into_inner();
    match simplemail(data.email.to_string(), data.name.to_string(), data.message.to_string()) {
        Ok(_) => format!("Thank you for your message {}! I'll get back to you as soon as possible.", &data.name),
        Err(e) => format!("I am sorry, but there has been an error transmitting your Message: {:?}", e)
    }
}

// Catches all OPTION requests in order to get the CORS related Fairing triggered.
#[options("/<_..>")]
fn options_catchall() {
    /* Intentionally left empty */
}

pub struct Cors;

#[rocket::async_trait]
impl Fairing for Cors {
    fn info(&self) -> Info {
        Info {
            name: "Cross-Origin-Resource-Sharing Fairing",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
        response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        response.set_header(Header::new(
            "Access-Control-Allow-Methods",
            "HEAD, OPTIONS, GET", //POST, PATCH, PUT, DELETE, not allowed cross-origin for now.
        ));
        response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
        response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
    }
}


#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(Cors)
        .mount("/", routes![index, servestatic, options_catchall, msg])

}
