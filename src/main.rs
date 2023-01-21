use rocket::form::Form;
use rocket::fs::NamedFile;
use std::path::{Path, PathBuf};
use std::{fs, env};


#[macro_use]
extern crate rocket;

#[get("/")]
fn index() -> String {
    listcurrentdir()
    //"Hello, let's test this even more.".to_string()
}

#[get("/hello")]
fn hello() -> String {
    "Why hello to you too, sir!".to_string()
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).await.ok()
}


fn listcurrentdir() -> String {
    let mut  output = String::new();
     for file in fs::read_dir(env::current_dir().unwrap()).unwrap() {
         //println!("{}", );
         output += &file.unwrap().path().display().to_string();
         output += "   ";
    }
    output
}

#[derive(FromForm)]
struct Msg<'r> {
    name: &'r str,
    email: &'r str,
    message: &'r str,
}

#[post("/msg", format = "form",  data = "<formdata>")]
fn msg(formdata: Form<Msg<'_>>) -> String {
    format!("Message submitted! Your name: {}, your E-Mail: {} and your Message: {}", formdata.name, formdata.email, formdata.message)
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index, hello, files, msg])

}
