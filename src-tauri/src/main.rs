#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::sync::Mutex;

use solana_rpc_client::nonblocking::rpc_client::RpcClient;
use solana_sdk::{signature::Keypair, signer::Signer};
use solana_test_validator::TestValidator;
use solana_streamer::socket::SocketAddrSpace;
// use solana_rpc_client::
//
// Read this if you want to understand what we're doing here
// https://gist.github.com/captainhusaynpenguin/5bdb6fcb141628b6865619bcd1c827fd#example-implementation
struct Validator(Mutex<Option<RpcClient>>);

#[tauri::command]
async fn rpc(rpc: &str, body: &str, validator: tauri::State<'_, Validator>) -> String {
  let mut v = validator.0.lock().unwrap();
  if v.is_some() {
    v.unwrap()
  }
}


#[tauri::command]
fn start_test_validator(private_key: &str, validator: tauri::State<Validator>) {
  let mut v = validator.0.lock().unwrap();
  if v.is_none() {
    let pk = Keypair::from_base58_string(private_key);
    let test_validator = TestValidator::with_no_fees(pk.pubkey(), None, SocketAddrSpace::Unspecified);
    *v = Some(test_validator.get_async_rpc_client());
  }
}

#[tauri::command]

fn main() {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![start_test_validator])
    .manage(Validator(Default::default()))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
