// use std::sync::Mutex;
// use serde::Deserialize;
// use tauri::State;

// use solana_rpc_client::{nonblocking::rpc_client::RpcClient, rpc_client::{SerializableMessage, SerializableTransaction}};
// use solana_sdk::{signature::Keypair, signer::Signer};
// use solana_test_validator::TestValidator;
// use solana_streamer::socket::SocketAddrSpace;


// pub enum LavaStatus {
//   Ready,
//   Errored,
//   Unitialized
// }
// pub struct LavaSuite {
//   pub status: LavaStatus,
//   pub validator: Option<TestValidator>,
//   pub rpc: Option<RpcClient>
// }

// impl Default for LavaSuite {
//   fn default() -> Self {
//       LavaSuite { status: LavaStatus::Unitialized, validator: None, rpc: None }
//   }
// }
// pub struct LavaValidator(pub Mutex<LavaSuite>);

// // #[tauri::command]
// // pub async fn rpc(command: RPCEnum, inputs: String, validator: State<LavaValidator>) -> String {
// //   let mut v = *validator.0.lock().unwrap();
// //   if let Some(rpc) = v.rpc {
// //     let tx_hex = hex::decode(validator);
// //     let tx = Transaction::from(&tx_hex);
// //     match rpc.send_and_confirm_transaction(&tx).await {
// //       Ok(s) => {
// //         return response(true, s.to_string().as_str())
// //       },
// //       Err(e) => return response(false, e.to_string())
// //     }
// //     return "{ \"status\": \"success\", \"message\": \"It worked!\"}".to_string()
// //   } else {
// //     return "{ \"status\": \"success\", \"message\": \"RPC is not initialized\"}".to_string()
// //   }
// // }

// pub fn response(success: bool, message: &str) -> String {
//   let status = match success {
//     true => "success",
//     false => "error"
//   };
//   format!("{{\"status\": {}, \"message\": {}}}", status, message)
// }

// // use std::sync::Mutex;
// // use solana_rpc_client::nonblocking::rpc_client::RpcClient;
// // use solana_sdk::{signature::Keypair, signer::Signer};
// // use solana_test_validator::TestValidator;
// // use solana_streamer::socket::SocketAddrSpace;

// // struct Validator(Mutex<Option<RpcClient>>);

// // pub struct LavaValidator {
// //     pub status: LavaValidatorStatus,
// //     pub validator: Option<TestValidator>
// // }

// // pub enum LavaValidatorStatus {
// //     Running,
// //     Stopped,
// //     Errored
// // }

// // impl Default for LavaValidator {
// //     fn default() -> Self {
// //         LavaValidator { 
// //             status: LavaValidatorStatus::Stopped, 
// //             validator: None
// //         }
// //     }

// //     async fn rpc(&self) -> {
// //         match self.validator {
// //             Some(v) => {

// //             },
// //             None =>
// //         }
// //     }
// // }

// // impl LavaValidator {

// //     // pub fn new() -> LavaValidator {
// //     //     Self {
// //     //         sender: Arc::new(Mutex::new(None))
// //     //     }
// //     // }
    
// //     // pub fn start_server(&self, port: i16) -> LavaValidator {
// //     //     let (sender, receiver) = mpsc::channel();

// //     //     let receiver = Arc::new(Mutex::new(receiver));

// //     //     thread::spawn(move || {
// //     //         let listener = TcpListener::bind("127.0.0.1:".to_owned() + &*port.to_string()).unwrap();

// //     //         for stream in listener.incoming() {
// //     //             let stream = stream.unwrap();

// //     //             println!("Connection established!");

// //     //         }

// //     //         let message = receiver.lock().unwrap().recv().unwrap();

// //     //         match message {
// //     //             Message::Terminate => {
// //     //                 println!("Worker was told to terminate." );

// //     //             },
// //     //         }
// //     //     });

// //     //     let sender = Arc::new(Mutex::new(Some(sender)));

// //     //     Self {
// //     //         sender
// //     //     }
// //     // }

// //     // pub fn stop(&self) -> Result<(), String> {

// //     //     println!("Worker was told to terminate." );
// //     //     Ok(())
// //     // }

// // }