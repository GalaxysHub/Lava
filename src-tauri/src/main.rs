#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{signature::Keypair, signer::Signer};
use solana_streamer::socket::SocketAddrSpace;
use solana_test_validator::TestValidator;
use std::{sync::Arc, net::{SocketAddr, IpAddr, Ipv4Addr}};
// use tauri::State;
// use core::slice::SlicePattern;
// use std::sync::Mutex;

// pub enum LavaStatus {
//   Ready,
//   Errored,
//   Unitialized
// }

// pub struct LavaValidator(pub Mutex<TestValidator>);
// use validator::{
//   // start_validator,
//   //  stop_validator, // need to implement
//   //  rpc, 
//   // LavaSuite,
//   response,
//   // LavaStatus,
//   //  LavaValidator
// };

// pub fn response(success: bool, message: &str) -> String {
//   let status = match success {
//     true => "success",
//     false => "error"
//   };
//   format!("{{\"status\": {}, \"message\": {}}}", status, message)
// }


// #[tauri::command]
// async fn start_validator(private_key: &str, validator: State<'static, LavaValidator>) -> String {
//   println!("Time to start the validator!");
//   let v = validator.0.lock().unwrap();
//   match &v.validator {
//     Some(v) => {
//       response(false, &format!("Validator already started here: {}", v.rpc_url()))
//     },
//     None => {
//       let pk = Keypair::from_base58_string(private_key);
//       let test_validator = TestValidator::with_no_fees(pk.pubkey(), None, SocketAddrSpace::Unspecified);
//       // let rpc = test_validator.get_async_rpc_client();
//       // let rpc_url = test_validator.rpc_url();
//       // let
//       // v = LavaSuite {
//         // status: LavaStatus::Ready,
//         // validator: Some(test_validator),
//         // rpc: Some(rpc)
//       // };
//       v = test_validator;
//       response(true, &format!("Validator running on {}, ", rpc_url))
//     }
//   }
// }

fn main() {
  tauri::Builder::default()
    .setup({
        move |app| {
          init_validator();
          Ok(())
        }
    })
    // .invoke_handler(tauri::generate_handler![
      // start_validator,
      // rpc,
      // stop_validator
    // ])
    // .setup(|app| {
    //   tauri::async_runtime::spawn(async move {
    //     let kp = Keypair::new();
    //     let test_validator = TestValidator::with_no_fees(kp.pubkey(), None, SocketAddrSpace::Unspecified);
    //   });
    //   Ok(())
    // })
    // .manage(LavaValidator(Default::default()))
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

pub struct ValidatorState {
  validator: Arc<TestValidator>,
  keypair: Arc<Keypair>
}


fn init_validator() {
  println!("Test");
  let keypair = Keypair::new();
  let faucet_addr = SocketAddr::new(
    IpAddr::V4(Ipv4Addr::new(127,0,0,1)),
    8899,
  );
  let test_validator = Arc::new(TestValidator::with_no_fees(keypair.pubkey(), Some(faucet_addr), SocketAddrSpace::Unspecified));
  let client = RpcClient::new(test_validator.rpc_url());
  let account_balance = client.get_balance(&keypair.pubkey()).unwrap();
  println!("{:?}", account_balance);
  println!("{}", test_validator.rpc_url());
  // let validator_state = ValidatorState {
  //     keypair: Arc::new(keypair),
  //     validator
  // };

  // Ok(node_state)
}
