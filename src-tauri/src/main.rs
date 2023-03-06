#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#![allow(unused_imports)]

use json::{JsonValue, object};
use solana_sdk::{signature::Keypair, signer::Signer};
use solana_streamer::socket::SocketAddrSpace;
use solana_test_validator::TestValidator;
use tauri::{Window, Manager};
use std::{net::{SocketAddr, IpAddr, Ipv4Addr}, thread, error::Error};

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      start_validator
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn start_validator(pk: Vec<u8>, window: Window) ->  Result<String, String> {
  println!("{:?}", pk);

  let handle = window.app_handle();
  let keypair = match Keypair::from_bytes(&pk) {
    Ok(k) => k,
    Err(_) => return Err(responder(object!{
      error: "Invalid private key"
    }, false).into())
  };

  let node_thread = thread::spawn(move || {
    let validator = TestValidator::with_no_fees(keypair.pubkey(), None, SocketAddrSpace::Unspecified);
    let rpc_url = validator.rpc_url().to_string();
    // If we need to manage the validator for some reason, like for running shutdown or something, we can put it under management in Tauri, otherwise just let Tokio run it on a separate thread.
    // handle.manage(Arc::new(validator));
    responder(object!{
      rpc_url: rpc_url
    }, true)
  });

  let result = node_thread.join().unwrap();
  println!("{}", &result);
  Ok(result.into())
}

fn responder(d: JsonValue, success: bool) -> String {
  let mut response = json::JsonValue::new_object();
  response["success"] = success.into();
  response["result"] = d.into();
  response.dump()
}